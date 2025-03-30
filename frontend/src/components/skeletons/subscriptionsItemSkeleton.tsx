const SubscriptionItemSkeleton: React.FC = () => {
  return (
    <div className="flex animate-pulse items-center gap-x-3 py-2">
      <div className="h-10 w-10 rounded-full bg-gray-300"></div>
      <div className="h-8 w-[130px] rounded bg-gray-300"></div>
    </div>
  );
};

export default SubscriptionItemSkeleton;
