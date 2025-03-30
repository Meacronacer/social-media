import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";

export function formatMessageTimestamp(input: Date | string | number) {
  const date = input instanceof Date ? input : new Date(input);
  const now = new Date();

  // Если сообщение сегодня
  if (isToday(date)) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 60) {
      return diffInMinutes === 0
        ? "Just now"
        : formatDistanceToNow(date, { addSuffix: true });
    }

    return format(date, "HH:mm");
  }

  // Если сообщение было вчера
  if (isYesterday(date)) {
    return "Yesterday";
  }

  // Если сообщение на этой неделе, показываем день недели
  if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return format(date, "EEE"); // "Sun", "Mon", и т.д.
  }

  // Если сообщение старше недели, показываем полную дату
  return format(date, "MM/dd/yyyy");
}

export const formatTimeForChatBody = (timestamp: Date) => {
  if (!timestamp) return null;
  return format(new Date(timestamp), "hh:mm a"); // 11:36 PM
};

export const formatDateHeader = (timestamp: Date) => {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  if (isToday(date)) return "Сегодня";
  if (isYesterday(date)) return "Вчера";
  return format(date, "dd MMMM yyyy"); // 29 января 2025
};

import { useMemo } from "react";
import { IMessage } from "@/@types/message";

interface FormattedMessage extends IMessage {
  showAvatar: boolean;
  showTimestamp: boolean;
  showDateHeader: boolean;
}

export function useFormattedMessages(messages: IMessage[]): FormattedMessage[] {
  return useMemo(() => {
    return messages.map((message, index) => {
      const prevMessage = messages[index - 1];
      const nextMessage = messages[index + 1];

      const isSameSenderAsPrev =
        prevMessage && prevMessage.sender === message.sender;
      const isSameSenderAsNext =
        nextMessage && nextMessage.sender === message.sender;

      const isTimeCloseToPrev =
        prevMessage &&
        new Date(message.timestamp).getTime() -
          new Date(prevMessage.timestamp).getTime() <
          5 * 60 * 1000;
      const isTimeCloseToNext =
        nextMessage &&
        new Date(nextMessage.timestamp).getTime() -
          new Date(message.timestamp).getTime() <
          5 * 60 * 1000;

      const showAvatar = !isSameSenderAsPrev || !isTimeCloseToPrev;
      const showTimestamp = !isSameSenderAsNext || !isTimeCloseToNext;
      const showDateHeader =
        index === 0 ||
        new Date(prevMessage?.timestamp).toDateString() !==
          new Date(message.timestamp).toDateString();

      return {
        ...message,
        showAvatar,
        showTimestamp,
        showDateHeader,
      };
    });
  }, [messages]);
}
