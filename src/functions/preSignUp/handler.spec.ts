import { handle } from './handler';

describe('Pre SignUp Handle', () => {
  test('should set autoConfirmUser to true in the event response', async () => {
    const event = {
      response: {
        autoConfirmUser: false,
      },
    };

    const result = await handle(event);

    expect(result.response.autoConfirmUser).toBe(true);
  });

  test('should return the event object unchanged if autoConfirmUser is already true', async () => {
    const event = {
      response: {
        autoConfirmUser: true,
      },
    };

    const result = await handle(event);

    expect(result).toEqual(event);
  });
});
