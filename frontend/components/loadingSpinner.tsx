export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-violet-600"></div>
        <p className="text-sm font-medium text-gray-600 animate-pulse">
          กำลังตรวจสอบสิทธิ์...
        </p>
      </div>
    </div>
  );
};