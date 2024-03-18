export const handle = async (event: any) => {
  event.response.issueTokens = true;
  event.response.failAuthentication = false;
  return event;
};

export const main = handle;
