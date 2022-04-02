export const keyBy = <T>(objects: T[], keyMapper: (val: T) => string): Record<string, T> => {
  return objects.reduce((acc, current) => {
    const key = keyMapper(current);
    acc[key] = current;

    return acc;
  }, {} as Record<string, T>);
};
