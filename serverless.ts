import type { AWS } from '@serverless/typescript';

import token from '@functions/token';
import signUp from '@functions/signUp';
import preSignUp from '@functions/preSignUp';

const serverlessConfiguration: AWS = {
  service: 'lambda-cognito-auth',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'cognito-idp:InitiateAuth',
          'cognito-idp:AdminCreateUser',
          'cognito-idp:AdminUpdateUserAttributes',
          'cognito-idp:AdminSetUserPassword',
        ],
        Resource: '*',
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      COGNITO_CLIENT_ID: '${env:COGNITO_CLIENT_ID}',
      COGNITO_USER_POOL_ID: '${env:COGNITO_USER_POOL_ID}',
    },
  },
  functions: { token, signUp, preSignUp },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
