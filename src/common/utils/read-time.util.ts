export const calculateReadTime = (content: string): number => {
  if (!content) return 1;

  const plainText = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = plainText ? plainText.split(' ').length : 0;
  const wordsPerMinute = 200;

  return Math.max(1, Math.ceil(words / wordsPerMinute));
};