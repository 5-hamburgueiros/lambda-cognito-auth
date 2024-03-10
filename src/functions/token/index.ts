import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: 'GenerateTokenLambdaFunction',
  events: [
    {
      http: {
        method: 'post',
        path: 'auth/token',
      },
    },
  ],
};
