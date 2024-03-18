export const handle = async (event: any) => {
  console.log(event);
  event.response.publicChallengeParameters = {
    email: event.request.userAttributes.email,
    maxAttempts: 3,
    attempts: event.request.session,
    attemptsLeft: 3 - event.request.session.length,
  };

  event.response.privateChallengeParameters = {
    cpf: event.request.userAttributes.cpf,
  };

  event.response.challengeMetadata = `${event.request.userAttributes.cpf}`;

  return event;
};

export const main = handle;
