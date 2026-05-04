"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type HorizontalDragScrollProps = React.HTMLAttributes<HTMLDivElement>;

export function HorizontalDragScroll({
  className,
  children,
  onClickCapture,
  onPointerCancel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWheel,
  ...props
}: HorizontalDragScrollProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const draggedRef = useRef(false);
  const clickSuppressedRef = useRef(false);
  const clickResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (clickResetTimerRef.current) {
        clearTimeout(clickResetTimerRef.current);
      }
    };
  }, []);

  const startSuppressClickWindow = () => {
    clickSuppressedRef.current = true;
    if (clickResetTimerRef.current) {
      clearTimeout(clickResetTimerRef.current);
    }
    clickResetTimerRef.current = setTimeout(() => {
      clickSuppressedRef.current = false;
    }, 0);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      onPointerUp?.(event);
      return;
    }
    const node = hostRef.current;
    if (node && pointerIdRef.current !== null) {
      try {
        node.releasePointerCapture(pointerIdRef.current);
      } catch {
        // Pointer may already be released by the browser.
      }
    }
    pointerIdRef.current = null;
    setIsDragging(false);
    if (draggedRef.current) {
      startSuppressClickWindow();
    }
    draggedRef.current = false;

    onPointerUp?.(event);
  };

  return (
    <div
      ref={hostRef}
      className={cn(
        "no-scrollbar overflow-x-auto",
        isDragging && "cursor-grabbing select-none",
        className,
      )}
      style={{ touchAction: "pan-y", ...(props.style ?? {}) }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;
        const node = hostRef.current;
        if (!node) return;
        if (node.scrollWidth <= node.clientWidth) return;

        pointerIdRef.current = event.pointerId;
        dragStartXRef.current = event.clientX;
        dragStartScrollLeftRef.current = node.scrollLeft;
        draggedRef.current = false;
        setIsDragging(true);
        node.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (event.defaultPrevented) return;
        const node = hostRef.current;
        if (!node) return;
        if (pointerIdRef.current !== event.pointerId) return;

        const deltaX = event.clientX - dragStartXRef.current;
        if (Math.abs(deltaX) > 4) {
          draggedRef.current = true;
        }
        node.scrollLeft = dragStartScrollLeftRef.current - deltaX;
        if (draggedRef.current) {
          event.preventDefault();
        }
      }}
      onPointerUp={endDrag}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        if (event.defaultPrevented) return;
        if (pointerIdRef.current !== event.pointerId) return;
        const node = hostRef.current;
        if (node && pointerIdRef.current !== null) {
          try {
            node.releasePointerCapture(pointerIdRef.current);
          } catch {
            // Pointer may already be released by the browser.
          }
        }
        pointerIdRef.current = null;
        setIsDragging(false);
        draggedRef.current = false;
      }}
      onWheel={(event) => {
        onWheel?.(event);
        if (event.defaultPrevented) return;

        const node = hostRef.current;
        if (!node) return;
        if (node.scrollWidth <= node.clientWidth) return;

        const useDeltaY = Math.abs(event.deltaY) > Math.abs(event.deltaX);
        const delta = useDeltaY ? event.deltaY : event.deltaX;
        if (!delta) return;

        const canScrollLeft = node.scrollLeft > 0;
        const canScrollRight = node.scrollLeft + node.clientWidth < node.scrollWidth - 1;
        if ((delta < 0 && !canScrollLeft) || (delta > 0 && !canScrollRight)) {
          return;
        }

        event.preventDefault();
        node.scrollLeft += delta;
      }}
      onClickCapture={(event) => {
        onClickCapture?.(event);
        if (event.defaultPrevented) return;
        if (!clickSuppressedRef.current) return;
        event.preventDefault();
        event.stopPropagation();
      }}
      {...props}
    >
      {children}
    </div>
  );
}
