import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
} from '@aws-sdk/client-cognito-identity-provider';
import 'dotenv/config';

const { NODE_ENV } = process.env;

const isDevelopment = NODE_ENV === 'development';

const clientConfig: CognitoIdentityProviderClientConfig = {
  region: 'us-east-1',
};

if (isDevelopment) {
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}
export const cognitoClient = new CognitoIdentityProviderClient(clientConfig);
