import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import 'dotenv/config';

export const cognitoClient = new CognitoIdentityProviderClient({
  region: 'us-east-1',
});
