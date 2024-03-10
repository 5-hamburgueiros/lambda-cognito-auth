import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import 'dotenv/config';
import { middyfy } from '@libs/lambda';
import { z } from 'zod';
import { cognitoClient } from '@libs/cognito';
import { cpfSchema, cpfSchemaType } from '@/schema';

const handle: ValidatedEventAPIGatewayProxyEvent<cpfSchemaType> = async (event) => {
  try {
    const { cpf } = cpfSchema.parse(event.body);
    const createUserParams: AdminCreateUserCommandInput = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: cpf,
      TemporaryPassword: 'Temp1234!',
    };

    const command = new AdminCreateUserCommand(createUserParams);
    await cognitoClient.send(command);

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
    if (error instanceof UsernameExistsException) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'User already exists' }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const main = middyfy(handle);
