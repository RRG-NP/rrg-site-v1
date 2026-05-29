/** Skeleton shown while the blog listing streams in. */
export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8 lg:pt-32">
      <div className="mb-12 max-w-2xl animate-pulse">
        <div className="mb-4 h-4 w-40 rounded bg-bg-2" />
        <div className="mb-3 h-10 w-72 rounded bg-bg-2" />
        <div className="h-5 w-full max-w-md rounded bg-bg-2" />
      </div>

      <div className="mb-10 h-12 w-full animate-pulse rounded-full bg-bg-2" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-gray-1">
            <div className="aspect-[16/9] w-full bg-bg-2" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-20 rounded bg-bg-2" />
              <div className="h-5 w-3/4 rounded bg-bg-2" />
              <div className="h-4 w-full rounded bg-bg-2" />
              <div className="h-4 w-2/3 rounded bg-bg-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
