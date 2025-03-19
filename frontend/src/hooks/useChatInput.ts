import { useState, useCallback } from "react";

export const useMessageInput = (sendMessage: (message: string) => void) => {
  const [message, setMessage] = useState("");

  // Модифицируем обработчик для поддержки прямого изменения значения
  const handleInputChange = useCallback(
    (input: React.ChangeEvent<HTMLInputElement> | string) => {
      if (typeof input === "string") {
        setMessage((prev) => prev + input); // Теперь добавляет эмодзи
      } else {
        setMessage(input.target.value);
      }
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (message.trim()) {
          sendMessage(message);
          setMessage("");
        }
      }
    },
    [message, sendMessage],
  );

  return {
    message,
    handleInputChange,
    handleKeyDown,
    setMessage, // Добавляем прямой доступ к setMessage
  };
};
