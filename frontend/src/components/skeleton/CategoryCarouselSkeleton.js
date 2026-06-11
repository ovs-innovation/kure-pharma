const CategoryCarouselSkeleton = ({ count = 6 }) => (
  <div
    className="flex gap-4 overflow-hidden my-10 px-3 animate-pulse"
    aria-hidden="true"
  >
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="flex-shrink-0 w-52 h-56 bg-white rounded-2xl border border-gray-100"
      >
        <div className="flex flex-col items-center p-4 h-full">
          <div className="w-24 h-24 rounded-full bg-gray-100 mb-3" />
          <div className="h-3 bg-gray-100 rounded w-3/4 mt-auto" />
        </div>
      </div>
    ))}
  </div>
);

export default CategoryCarouselSkeleton;
