import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";

export function formatMessageTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
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

export const formatTimeForChatBody = (timestamp: string) => {
  if (!timestamp) return undefined;
  return format(new Date(timestamp), "hh:mm a"); // 11:36 PM
};

export const formatDateHeader = (timestamp: string) => {
  if (!timestamp) return undefined;
  const date = new Date(timestamp);
  if (isToday(date)) return "Сегодня";
  if (isYesterday(date)) return "Вчера";
  return format(date, "dd MMMM yyyy"); // 29 января 2025
};
