// Utility function to deeply omit fields from an object
export function omitDeep<T extends Record<string, unknown>>(obj: T, keyToOmit: string): T {
  if (Array.isArray(obj)) {
    return obj.map(item => omitDeep(item as T, keyToOmit)) as unknown as T;
  }

  if (obj !== null && typeof obj === 'object') {
    const result = {} as Record<string, unknown>;
    Object.keys(obj).forEach(key => {
      if (key === keyToOmit) {
        return;
      }
      const value = obj[key];
      if (value !== undefined) {
        // Handle nested objects recursively
        if (typeof value === 'object' && value !== null) {
          // For input types, we need to remove __typename from all levels
          const processedValue = omitDeep(value as Record<string, unknown>, keyToOmit);
          // Only include the value if it's not an empty object after processing
          if (Object.keys(processedValue).length > 0) {
            result[key] = processedValue;
          }
        } else {
          result[key] = value;
        }
      }
    });
    return result as T;
  }

  return obj;
}

interface ApolloParams {
  variables?: Record<string, unknown>;
  [key: string]: unknown;
}

// Apollo middleware to format parameters
export const formatApolloParams = (params: ApolloParams): ApolloParams => {
  const { variables, ...rest } = params;
  return {
    variables: variables ? omitDeep(variables, '__typename') : undefined,
    ...rest
  };
};
