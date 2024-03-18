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
});
