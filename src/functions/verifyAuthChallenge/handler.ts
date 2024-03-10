const handle = async (event) => {
  const cpf = event?.request?.privateChallengeParameters?.cpf;
  if (event.request.challengeAnswer === cpf) {
    event.response.answerCorrect = true;
  } else {
    event.response.answerCorrect = false;
  }
  return event;
};

export const main = handle;
