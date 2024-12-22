import Image from "next/image";

interface props {
  image: string;
  name: string;
}

const SubscriptionItem: React.FC<props> = ({ image, name }) => {
  return (
    <div className="flex cursor-pointer items-center gap-x-3 py-2 hover:bg-active">
      <Image
        src={image}
        className="rounded-[50%]"
        height={32}
        width={32}
        alt={name}
      />
      <span className="text-[14px] font-bold">{name}</span>
    </div>
  );
};

export default SubscriptionItem;
