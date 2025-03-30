import { useState, useCallback } from "react";

export const useMessageInput = (sendMessage: (message: string) => void) => {
  const [message, setMessage] = useState("");

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
    sendMessage,
    handleKeyDown,
    setMessage, // Добавляем прямой доступ к setMessage
  };
};
