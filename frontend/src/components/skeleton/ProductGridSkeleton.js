import { PRODUCT_GRID_CLASS, PRODUCT_GRID_ITEM_CLASS } from "@utils/productGrid";

const ProductGridSkeleton = ({ count = 10 }) => (
  <div className={PRODUCT_GRID_CLASS} aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={`${PRODUCT_GRID_ITEM_CLASS} animate-pulse`}>
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden h-full">
          <div className="w-full pb-[75%] bg-gray-100" />
          <div className="p-3 sm:p-4 space-y-2">
            <div className="h-2.5 bg-gray-100 rounded w-1/3" />
            <div className="h-3.5 bg-gray-100 rounded w-full" />
            <div className="h-3.5 bg-gray-100 rounded w-4/5" />
            <div className="h-4 bg-gray-100 rounded w-1/2 mt-2" />
            <div className="h-8 bg-gray-100 rounded-lg w-full mt-3" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ProductGridSkeleton;
