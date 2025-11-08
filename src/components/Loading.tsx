export default function Loading({ size = 12 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className={`w-${size} h-${size} border-4 border-t-transparent border-gray-500 rounded-full animate-spin`}
      />
    </div>
  );
}
