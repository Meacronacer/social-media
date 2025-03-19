export const getChatId = (
  userId1: string | undefined,
  userId2: string | undefined,
): string => {
  if (!userId1 || !userId2) return "";
  return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
};
