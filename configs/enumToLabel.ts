export const getEnumToLabel = (enumValue: string | number): string => {
  if (typeof enumValue !== 'string') {
    return 'N/A';
  }
  const normalized = enumValue.replace(/([a-z])([A-Z])/g, '$1_$2');

  return normalized
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
