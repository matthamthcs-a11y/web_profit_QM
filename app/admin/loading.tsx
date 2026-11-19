export default function AdminLoading() {
  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <div className="animate-pulse space-y-6">
        <div className="space-y-2">
          <div className="h-3.5 w-28 rounded bg-slate-200" />
          <div className="h-8 w-64 rounded bg-slate-200" />
          <div className="h-4 w-96 max-w-full rounded bg-slate-100" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-lg border border-line bg-white p-4"
            >
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="mt-3 h-6 w-12 rounded bg-slate-200" />
            </div>
          ))}
        </div>

        <div className="h-16 rounded-lg border border-line bg-white p-4" />

        <div className="overflow-hidden rounded-lg border border-line bg-white">
          <div className="h-11 border-b border-line bg-surface/70" />
          <div className="divide-y divide-line">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4">
                <div className="h-4 w-28 rounded bg-slate-200" />
                <div className="h-4 w-24 rounded bg-slate-100" />
                <div className="h-4 flex-1 rounded bg-slate-200" />
                <div className="h-4 w-20 rounded bg-slate-100" />
                <div className="h-8 w-28 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
