export default function AdminLoading() {
  return (
    <section className="container-px mx-auto max-w-7xl py-10">
      <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
      <div className="mt-3 h-9 w-72 animate-pulse rounded bg-slate-100" />
      <div className="mt-8 grid gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded border border-line bg-slate-50"
          />
        ))}
      </div>
    </section>
  );
}
