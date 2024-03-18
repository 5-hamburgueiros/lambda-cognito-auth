export const handle = async (event) => {
  console.log(event);
  event.response.issueTokens = true;
  event.response.failAuthentication = false;
  return event;
};

export const main = handle;
