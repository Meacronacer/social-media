import { useState, useEffect } from "react";

const Switch = () => {
  const [isChecked, setIsChecked] = useState(false);

  // Инициализация из LocalStorage
  useEffect(() => {
    try {
      const storedValue = localStorage.getItem("switchState");

      // Если значение отсутствует
      if (storedValue === null) {
        localStorage.setItem("switchState", "false");
        setIsChecked(false);
        return;
      }

      // Если значение невалидно
      if (storedValue !== "true" && storedValue !== "false") {
        localStorage.setItem("switchState", "false");
        setIsChecked(false);
        return;
      }

      // Корректное значение
      setIsChecked(storedValue === "true");
    } catch (error) {
      // Обработка ошибок доступа к LocalStorage
      console.error("Error accessing localStorage:", error);
      setIsChecked(false);
    }
  }, []);

  // Обработчик переключения
  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);

    try {
      localStorage.setItem("switchState", newValue.toString());
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        onChange={handleToggle}
      />
      <div
        className={`h-6 w-11 rounded-full bg-gray-200 transition-colors duration-200 ${
          isChecked ? "bg-primary" : "bg-gray-400"
        }`}
      >
        <div
          className={`absolute left-[2px] top-0.5 h-5 w-5 rounded-full border-gray-300 bg-white transition-transform duration-200 ${
            isChecked ? "translate-x-5" : "translate-x-0"
          }`}
        ></div>
      </div>
    </label>
  );
};

export default Switch;
