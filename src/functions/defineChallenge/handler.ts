const MAX_ATTEMPTS = 3;

export const handle = async (event) => {
  console.log(event);
  event.response.issueTokens = true;
  event.response.failAuthentication = false;
  const attempts = event.request.session.length;
  const lastAttempt = event.request.session.slice(-1)[0];

  if (event.request.session && event.request.session.find((attempt) => attempt.challengeName !== 'CUSTOM_CHALLENGE')) {
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
  } else if (attempts >= MAX_ATTEMPTS && lastAttempt.challengeResult === false) {
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
  } else if (
    attempts >= 1 &&
    lastAttempt.challengeName === 'CUSTOM_CHALLENGE' &&
    lastAttempt.challengeResult === true
  ) {
    event.response.issueTokens = true;
    event.response.failAuthentication = false;
  } else {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = 'CUSTOM_CHALLENGE';
  }

  return event;
};

export const main = handle;
