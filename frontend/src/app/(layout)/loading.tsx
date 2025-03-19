// app/loading.js
export default function Loading() {
  return (
    <div className="fixed left-0 top-1 h-1 w-full">
      <div className="animate-progress h-full bg-gradient-to-r from-purple-300 to-purple-950" />
    </div>
  );
}
