export const handle = async (event) => {
  event.response.issueTokens = true;
  event.response.failAuthentication = false;
  return event;
};

export const main = handle;
