export default function Loading() {
  return (
    <main className="container-px mx-auto max-w-7xl py-14">
      <div className="grid gap-4">
        <div className="h-8 w-56 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-slate-100" />
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded border border-line bg-slate-50"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
