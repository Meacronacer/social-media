const IsLoading = () => {
  return (
    <div
      className="absolute inset-0 top-10 mx-auto h-[100px] w-[100px] animate-spin rounded-full border-[15px] border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

export default IsLoading;
