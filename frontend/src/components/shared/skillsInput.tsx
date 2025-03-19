import { useState, useEffect } from "react";

interface SkillsInputProps {
  value: string;
  onChange: (newSkills: string) => void;
}

const SkillsInput = ({ value, onChange }: SkillsInputProps) => {
  const [skillsList, setSkillsList] = useState<string[]>(() =>
    value.split(", ").filter(Boolean),
  );
  const [inputValue, setInputValue] = useState("");

  // Обновляем локальное состояние, когда value изменяется
  useEffect(() => {
    setSkillsList(value.split(", ").filter(Boolean));
  }, [value]);

  const handleSkillsKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const trimmedInputValue = inputValue.trim();

    // Добавляем скилл по пробелу или Enter
    if (
      (e.key === " " || e.key === "Enter") &&
      trimmedInputValue &&
      !skillsList.includes(trimmedInputValue)
    ) {
      const newSkillsList = [...skillsList, trimmedInputValue];
      setSkillsList(newSkillsList);
      onChange(newSkillsList.join(", "));
      setInputValue(""); // Очищаем поле ввода после добавления скилла
      e.preventDefault(); // Предотвращаем добавление пробела или переход на новую строку
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = skillsList.filter((s) => s !== skill);
    setSkillsList(updatedSkills);
    onChange(updatedSkills.join(", "));
  };

  return (
    <div className="relative flex w-full flex-col gap-y-[2px]">
      <label className="text-light-transparent text-[12px]">Skills</label>
      <input
        type="text"
        className="w-full border-b border-gray-300 bg-black p-2 text-white focus:outline-none"
        placeholder="Enter skills, press space or Enter to add"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleSkillsKeyPress}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {skillsList.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-full border px-3 py-1"
          >
            <span className="uppercase">{skill}</span>
            <button
              type="button"
              className="text-red-500"
              onClick={() => handleRemoveSkill(skill)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsInput;
