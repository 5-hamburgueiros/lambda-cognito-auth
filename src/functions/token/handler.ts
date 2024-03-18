import {
  InitiateAuthCommand,
  NotAuthorizedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { middyfy } from '@libs/lambda';
import { z } from 'zod';
import 'dotenv/config';
import { cognitoClient } from '@libs/cognito';
import { cpfSchema } from '@/schema';

export const handle = async (event) => {
  try {
    const { cpf } = cpfSchema.parse(event.body);
    const command = new InitiateAuthCommand({
      AuthFlow: 'CUSTOM_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: cpf,
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    const payload = {
      accessToken: AuthenticationResult?.AccessToken,
      refreshToken: AuthenticationResult?.RefreshToken,
      type: AuthenticationResult?.TokenType,
      expiresIn: AuthenticationResult?.ExpiresIn,
    };
    return {
      statusCode: 200,
      body: JSON.stringify(payload),
    };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.issues }),
      };
    }

    if (error instanceof NotAuthorizedException) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    if (error instanceof UserNotFoundException) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const main = middyfy(handle);
