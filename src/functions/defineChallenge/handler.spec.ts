import { handle } from './handler';

describe('Define Challenge Handle', () => {
  test('should issue tokens and pass authentication when all conditions are met', async () => {
    const event = {
      request: {
        session: [{ challengeName: 'CUSTOM_CHALLENGE', challengeResult: true }],
      },
      response: {},
    };

    const result = await handle(event);

    expect(result.response.issueTokens).toBe(true);
    expect(result.response.failAuthentication).toBe(false);
  });

  test('should not issue tokens and fail authentication if challenge name is not CUSTOM_CHALLENGE', async () => {
    const event = {
      request: {
        session: [{ challengeName: 'SOME_OTHER_CHALLENGE', challengeResult: true }],
      },
      response: {},
    };

    const result = await handle(event);

    expect(result.response.issueTokens).toBe(false);
    expect(result.response.failAuthentication).toBe(true);
  });

  test('should not issue tokens and fail authentication if last attempt fails after maximum attempts reached', async () => {
    const event = {
      request: {
        session: [
          { challengeName: 'CUSTOM_CHALLENGE', challengeResult: true },
          { challengeName: 'CUSTOM_CHALLENGE', challengeResult: false },
          { challengeName: 'CUSTOM_CHALLENGE', challengeResult: false },
        ],
      },
      response: {},
    };

    const result = await handle(event);

    expect(result.response.issueTokens).toBe(false);
    expect(result.response.failAuthentication).toBe(true);
  });

  test('should not issue tokens and fail authentication if last attempt passes after maximum attempts reached', async () => {
    const event = {
      request: {
        session: [
          { challengeName: 'CUSTOM_CHALLENGE', challengeResult: true },
          { challengeName: 'CUSTOM_CHALLENGE', challengeResult: false },
          { challengeName: 'CUSTOM_CHALLENGE', challengeResult: true },
        ],
      },
      response: {},
    };

    const result = await handle(event);

    expect(result.response.issueTokens).toBe(true);
    expect(result.response.failAuthentication).toBe(false);
  });

  test('should initiate CUSTOM_CHALLENGE if none of the above conditions are met', async () => {
    const event = {
      request: {
        session: [],
      },
      response: {},
    };

    const result = await handle(event);

    expect(result.response.issueTokens).toBe(false);
    expect(result.response.failAuthentication).toBe(false);
    expect(result.response.challengeName).toBe('CUSTOM_CHALLENGE');
  });
});
