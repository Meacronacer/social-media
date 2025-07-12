import { IAuthor } from "@/@types/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo } from "react";

const SubscriptionItem: React.FC<IAuthor> = ({
  _id,
  img_url,
  first_name,
  second_name,
}) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/${_id}`)}
      className="flex cursor-pointer items-center gap-x-3 py-2 hover:bg-active"
    >
      <Image
        src={img_url || "/avatar.png"}
        className="h-8 w-8 rounded-[50%] object-cover object-center"
        height={32}
        width={32}
        alt="avatar"
      />
      <span className="text-[14px] font-bold">
        {first_name} {second_name}
      </span>
    </div>
  );
};

export default memo(SubscriptionItem);
