// @ts-nocheck

import { handle } from './handler';

jest.mock('@aws-sdk/client-cognito-identity-provider', () => ({
  InitiateAuthCommand: jest.fn(),
  NotAuthorizedException: jest.fn(),
  UserNotFoundException: jest.fn(),
}));
jest.mock('@libs/cognito', () => ({
  cognitoClient: {
    send: jest.fn(),
  },
}));

import {
  InitiateAuthCommand,
  NotAuthorizedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@libs/cognito';

describe('Token Handle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 200 and access token when authentication is successful', async () => {
    const event = { body: { cpf: '12345678900' } };

    const mockAuthenticationResult = {
      AccessToken: 'accessToken',
      RefreshToken: 'refreshToken',
      TokenType: 'type',
      ExpiresIn: 'expiresIn',
    };

    cognitoClient.send.mockResolvedValueOnce({ AuthenticationResult: mockAuthenticationResult });

    const result = await handle(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      type: 'type',
      expiresIn: 'expiresIn',
    });
  });

  test('should return 400 and error message for invalid CPF', async () => {
    const event = { body: { cpf: '' } };
    const result = await handle(event);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toHaveProperty('error');
  });

  test('should return 400 and error message for invalid credentials', async () => {
    const event = { body: { cpf: '12345678901' } };
    InitiateAuthCommand.mockImplementationOnce(() => {
      throw new NotAuthorizedException();
    });

    const result = await handle(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ error: 'Invalid credentials' });
  });

  test('should return 404 and error message for user not found', async () => {
    const event = { body: { cpf: '12345678901' } };
    InitiateAuthCommand.mockImplementationOnce(() => {
      throw new UserNotFoundException();
    });

    const result = await handle(event);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ error: 'User not found' });
  });

  test('should return 500 for internal server error', async () => {
    const event = { body: { cpf: '12345678901' } };
    InitiateAuthCommand.mockImplementationOnce(() => {
      throw new Error('Some internal error');
    });

    const result = await handle(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Internal server error' });
  });
});
