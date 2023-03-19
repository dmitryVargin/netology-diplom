function getNonEmptyFields(fields: Record<string, any>): Record<string, any> {
  return Object.entries(fields).reduce(
    (acc: Record<string, any>, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    },
    {},
  );
}

export default getNonEmptyFields;
