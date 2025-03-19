const SubscriptionItemSkeleton: React.FC = () => {
  return (
    <div className="flex animate-pulse items-center gap-x-3 py-2">
      <div className="h-8 w-8 rounded-full bg-gray-300"></div>
      <div className="h-4 w-24 rounded bg-gray-300"></div>
    </div>
  );
};

export default SubscriptionItemSkeleton;
