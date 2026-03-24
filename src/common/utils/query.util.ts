export const toBoolean = (value?: string): boolean | undefined => {
  if (typeof value === 'undefined') return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};
