// @ts-nocheck

import { handle } from './handler';
import { AdminCreateUserCommand, UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@libs/cognito';

jest.mock('@aws-sdk/client-cognito-identity-provider', () => ({
  AdminCreateUserCommand: jest.fn(),
  UsernameExistsException: jest.fn(),
}));

jest.mock('@libs/cognito', () => ({
  cognitoClient: {
    send: jest.fn(),
  },
}));

describe('SignUp Handle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user and return 201 status code', async () => {
    const event = { body: { cpf: '12345678900' } };
    const result = await handle(event);
    expect(AdminCreateUserCommand).toHaveBeenCalledTimes(1);
    expect(AdminCreateUserCommand).toHaveBeenCalledWith({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: '12345678900',
      TemporaryPassword: 'Temp1234!',
    });

    expect(cognitoClient.send).toHaveBeenCalledTimes(1);
    expect(cognitoClient.send).toHaveBeenCalledWith(expect.any(AdminCreateUserCommand));
    expect(result.statusCode!).toBe(201);
  });
  it('should NOT create a user and when no cpf is provide and should return 400', async () => {
    const result = await handle({
      body: {},
    });
    expect(result.statusCode).toBe(400);
  });

  test('should return 409 and "User already exists" message when username already exists', async () => {
    const event = { body: { cpf: '12345678900' } };
    AdminCreateUserCommand.mockImplementationOnce(() => {
      throw new UsernameExistsException();
    });

    const result = await handle(event);
    expect(result.statusCode).toBe(409);
    expect(JSON.parse(result.body)).toEqual({ error: 'User already exists' });
  });

  test('should return 500 for internal server error', async () => {
    const event = { body: { cpf: '12345678900' } };
    cognitoClient.send.mockImplementationOnce(() => {
      throw new Error('Internal server error');
    });

    const result = await handle(event);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Internal server error' });
  });
});
