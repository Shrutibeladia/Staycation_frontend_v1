/**
 * Extract a user-friendly message from API error responses.
 */
export const getErrorMessage = (err, fallback = "Something went wrong. Please try again.") => {
  const data = err?.response?.data;
  if (!data) return fallback;

  if (typeof data === "string") return data;
  if (data.message) return data.message;
  if (data.errors?.length) return data.errors.map((e) => e.msg).join(", ");

  return fallback;
};

/**
 * Map validation errors (422) to field keys.
 */
export const getFieldErrors = (err) => {
  const errors = err?.response?.data?.errors;
  if (!Array.isArray(errors)) return {};
  return errors.reduce((acc, item) => {
    if (item.param) acc[item.param] = item.msg;
    return acc;
  }, {});
};
