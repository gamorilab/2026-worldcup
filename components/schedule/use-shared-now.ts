"use client";

import { useSyncExternalStore } from "react";

const VISIBLE_TICK_MS = 1000;
const HIDDEN_TICK_MS = 60_000;

const noopUnsubscribe = () => {};
const passiveSubscribe = () => noopUnsubscribe;

let nowMs = Date.now();
let timer: ReturnType<typeof setInterval> | null = null;
let visibilityListenerBound = false;
const subscribers = new Set<() => void>();

function emit() {
  nowMs = Date.now();
  subscribers.forEach((listener) => listener());
}

function currentTickRate() {
  if (typeof document === "undefined") return VISIBLE_TICK_MS;
  return document.visibilityState === "visible" ? VISIBLE_TICK_MS : HIDDEN_TICK_MS;
}

function ensureTimer() {
  const tickMs = currentTickRate();
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(emit, tickMs);
}

function onVisibilityChange() {
  if (!subscribers.size) return;
  ensureTimer();
  emit();
}

function ensureActive() {
  if (!timer) ensureTimer();
  if (typeof document === "undefined" || visibilityListenerBound) return;
  document.addEventListener("visibilitychange", onVisibilityChange);
  visibilityListenerBound = true;
}

function ensureInactive() {
  if (subscribers.size) return;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (typeof document === "undefined" || !visibilityListenerBound) return;
  document.removeEventListener("visibilitychange", onVisibilityChange);
  visibilityListenerBound = false;
}

function subscribe(listener: () => void) {
  subscribers.add(listener);
  ensureActive();
  return () => {
    subscribers.delete(listener);
    ensureInactive();
  };
}

function getSnapshot() {
  return nowMs;
}

function getServerSnapshot() {
  return 0;
}

export function useSharedNow(active = true): number {
  const subscribeFn = active ? subscribe : passiveSubscribe;
  return useSyncExternalStore(subscribeFn, getSnapshot, getServerSnapshot);
}
