export const capitalizeWords = (input: string) => {
  return input.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatText = (text: string) => {
  if (!text) {
    return '';
  }
  return text.replace(
    /\b[A-Z]+\b/g,
    (word) => word.charAt(0) + word.slice(1).toLowerCase()
  );
};
