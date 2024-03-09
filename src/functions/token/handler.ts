import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  NotAuthorizedException,
} from '@aws-sdk/client-cognito-identity-provider';
import { middyfy } from '@libs/lambda';
import { z } from 'zod';
import 'dotenv/config';

const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });
const schema = z.object({
  email: z.string(),
  password: z.string(),
});

type schemaType = z.infer<typeof schema>;

const handle: ValidatedEventAPIGatewayProxyEvent<schemaType> = async (event) => {
  try {
    const { email, password } = schema.parse(event.body);
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    const payload = {
      accessToken: AuthenticationResult?.IdToken,
      refreshToken: AuthenticationResult?.RefreshToken,
      type: AuthenticationResult?.TokenType,
      expiresIn: AuthenticationResult?.ExpiresIn,
    };
    return {
      statusCode: 200,
      body: JSON.stringify(payload),
    };
  } catch (error) {
    console.error('Error:', error);

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

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const main = middyfy(handle);
