// src/components/common/Spinner.jsx
export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin ${className}`} />
  );
}

// src/components/common/LoadingScreen.jsx — full-page loading
export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <Spinner size="lg" />
      <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
    </div>
  );
}
