import { handle } from './handler';

describe('Create Challenge Handle', () => {
  test.skip('should throw an error if CPF is missing', async () => {
    const event = {
      request: {
        userAttributes: {
          email: 'test@example.com',
        },
        session: [],
      },
      response: {},
    };

    await expect(handle(event)).rejects.toThrow('missing cpf');
  });

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
      response: { issueTokens: true, failAuthentication: false },
    };
    const result = await handle(event);
    console.log(result);
    expect(result).toEqual(expectedResult);
  });
});
