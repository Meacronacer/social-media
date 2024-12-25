export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div
      className="m-[200px] ml-[450px] inline-block h-[300px] w-[300px] animate-spin rounded-full border-[40px] border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}
