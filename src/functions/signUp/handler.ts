import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { AdminCreateUserCommand, AdminCreateUserCommandInput } from '@aws-sdk/client-cognito-identity-provider';
import 'dotenv/config';
import { middyfy } from '@libs/lambda';
import { z } from 'zod';
import { cognitoClient } from '@libs/cognito';

const signUpSchema = z.object({
  cpf: z.string(),
});

type zod = z.infer<typeof signUpSchema>;

const handle: ValidatedEventAPIGatewayProxyEvent<zod> = async (event) => {
  try {
    const { cpf } = signUpSchema.parse(event.body);
    const createUserParams: AdminCreateUserCommandInput = {
      UserPoolId: 'us-east-1_aVmQIZ4Cj',
      Username: cpf,
      TemporaryPassword: 'Temp1234!',
    };

    const command = new AdminCreateUserCommand(createUserParams);
    await cognitoClient.send(command);

    // const verifyEmailParams = {
    //   UserPoolId: process.env.COGNITO_USER_POOL_ID,
    //   Username: cpf,
    //   UserAttributes: [
    //     {
    //       Name: 'email_verified',
    //       Value: 'true',
    //     },
    //   ],
    // };

    // const verifyEmailCommand = new AdminUpdateUserAttributesCommand(verifyEmailParams);
    // await cognitoClient.send(verifyEmailCommand);

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
