export const handle = async (event) => {
  event.response.autoConfirmUser = true;
  return event;
};

export const main = handle;
