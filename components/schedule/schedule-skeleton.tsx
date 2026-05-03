export function ScheduleSkeleton() {
  return (
    <div className="min-h-screen pb-24 text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-10 pt-6 sm:px-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8">
          <div className="space-y-3">
            <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
            <div className="h-10 w-full max-w-2xl animate-pulse rounded bg-white/10" />
            <div className="h-4 w-full max-w-3xl animate-pulse rounded bg-white/10" />
          </div>
        </section>

        <section className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 sm:p-5">
          <div className="flex gap-2 overflow-x-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-9 w-28 animate-pulse rounded-full bg-white/10" />
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-11 animate-pulse rounded-2xl bg-white/10" />
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-9 w-24 animate-pulse rounded-full bg-white/10" />
            ))}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          ))}
        </section>
      </div>
    </div>
  );
}
