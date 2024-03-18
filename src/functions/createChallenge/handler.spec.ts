import { handle } from './handler';

describe('Create Challenge Handle', () => {
  test('should set response properties correctly if CPF is present', async () => {
    const event = {
      request: {
        userAttributes: {
          email: 'test@example.com',
          cpf: '12345678900',
        },
        session: ['attempt1', 'attempt2'],
      },
      response: {},
    };

    const expectedResult = {
      ...event,
      response: {
        publicChallengeParameters: {
          email: 'test@example.com',
          maxAttempts: 3,
          attempts: ['attempt1', 'attempt2'],
          attemptsLeft: 1, // 3 - 2 = 1
        },
        privateChallengeParameters: {
          cpf: '12345678900',
        },
        challengeMetadata: '12345678900',
      },
    };
    const result = await handle(event);
    expect(result).toEqual(expectedResult);
  });
});
