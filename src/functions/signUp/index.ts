import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  name: 'SignUpLambdaFunction',
  events: [
    {
      http: {
        method: 'post',
        path: 'sign-up',
      },
    },
  ],
};
