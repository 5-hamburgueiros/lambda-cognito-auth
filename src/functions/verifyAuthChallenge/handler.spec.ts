import { handle } from './handler';

describe('Verify Challenge Handle', () => {
  test('should set answerCorrect to true if challengeAnswer matches CPF', async () => {
    const event = {
      request: {
        privateChallengeParameters: {
          cpf: '12345678900',
        },
        challengeAnswer: '12345678900',
      },
      response: {},
    };

    const expectedResult = {
      request: {
        privateChallengeParameters: {
          cpf: '12345678900',
        },
        challengeAnswer: '12345678900',
      },
      response: {
        answerCorrect: true,
      },
    };

    const result = await handle(event);

    expect(result).toEqual(expectedResult);
  });

  test('should set answerCorrect to false if challengeAnswer does not match CPF', async () => {
    const event = {
      request: {
        privateChallengeParameters: {
          cpf: '12345678900',
        },
        challengeAnswer: '98765432100',
      },
      response: {},
    };

    const expectedResult = {
      request: {
        privateChallengeParameters: {
          cpf: '12345678900',
        },
        challengeAnswer: '98765432100',
      },
      response: {
        answerCorrect: false,
      },
    };

    const result = await handle(event);

    expect(result).toEqual(expectedResult);
  });
});
