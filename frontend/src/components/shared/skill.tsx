interface props {
  text: string;
}

const Skill: React.FC<props> = ({ text }) => {
  return (
    <div className="flex w-fit cursor-pointer items-center justify-center rounded-[2px] border px-2 py-1 duration-200 hover:bg-white/30">
      <span className="block text-[12px] font-bold">{text}</span>
    </div>
  );
};

export default Skill;
