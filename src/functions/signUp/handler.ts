import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminCreateUserCommandInput,
  AdminSetUserPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import 'dotenv/config';
import { middyfy } from '@libs/lambda';
import { z } from 'zod';

const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });
const signUpSchema = z.object({
  email: z.string(),
  password: z.string(),
  cpf: z.string(),
});

type zod = z.infer<typeof signUpSchema>;

const handle: ValidatedEventAPIGatewayProxyEvent<zod> = async (event) => {
  try {
    const { email, password, cpf } = signUpSchema.parse(event.body);
    const createUserParams: AdminCreateUserCommandInput = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      TemporaryPassword: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'custom:cpf',
          Value: cpf,
        },
      ],
    };

    const command = new AdminCreateUserCommand(createUserParams);
    await cognitoClient.send(command);

    const setUserPasswordParams = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      Password: password,
      Permanent: true,
    };

    const setUserPasswordCommand = new AdminSetUserPasswordCommand(setUserPasswordParams);
    await cognitoClient.send(setUserPasswordCommand);

    const verifyEmailParams = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      UserAttributes: [
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
    };

    const verifyEmailCommand = new AdminUpdateUserAttributesCommand(verifyEmailParams);
    await cognitoClient.send(verifyEmailCommand);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User created successfully' }),
    };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.issues }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const main = middyfy(handle);
