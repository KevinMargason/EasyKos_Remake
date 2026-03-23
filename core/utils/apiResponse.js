const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

export const unwrapApiData = (response) => {
  if (response == null) return response;
  if (Array.isArray(response)) return response;
  if (!isPlainObject(response)) return response;

  if (Object.prototype.hasOwnProperty.call(response, 'data')) {
    return response.data;
  }

  return response;
};

export const unwrapApiList = (response) => {
  const payload = unwrapApiData(response);
  if (Array.isArray(payload)) return payload;
  if (payload == null) return [];
  return [payload];
};

export const isSuccessfulResponse = (response) => {
  if (!isPlainObject(response)) return true;
  if (!Object.prototype.hasOwnProperty.call(response, 'success')) return true;
  return response.success !== false;
};
