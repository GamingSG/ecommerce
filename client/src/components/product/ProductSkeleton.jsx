// src/components/product/ProductSkeleton.jsx
export default function ProductSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-square shimmer-bg" />
      <div className="p-4 space-y-3">
        <div className="h-3 shimmer-bg rounded w-1/3" />
        <div className="h-4 shimmer-bg rounded w-full" />
        <div className="h-4 shimmer-bg rounded w-3/4" />
        <div className="h-3 shimmer-bg rounded w-1/4" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 shimmer-bg rounded w-20" />
          <div className="w-9 h-9 shimmer-bg rounded-xl" />
        </div>
      </div>
    </div>
  );
}
