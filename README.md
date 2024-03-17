# Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

## Test your service




### Locally


- `npx sls offline

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.


### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── singUp
│   │   │   ├── handler.ts      # `SingUp` lambda source code
│   │   │   ├── index.ts        # `SingUp` lambda Serverless configuration
│   │   │   ├── mock.json       # `SingUp` lambda input parameter, if any, for local invocation
│   │   ├── token
│   │   │   ├── handler.ts      # `Token` lambda source code
│   │   │   ├── index.ts        # `Token` lambda Serverless configuration
│   │   │   ├── mock.json       # `Token` lambda input parameter, if any, for local invocation
│   │   ├── preSingUp
│   │   │   ├── handler.ts      # `PreSingUp` lambda source code
│   │   │   ├── index.ts        # `PreSingUp` lambda Serverless configuration
│   │   ├── createChallenge
│   │   │   ├── handler.ts      # `CreateChallenge` lambda source code
│   │   │   ├── index.ts        # `CreateChallenge` lambda Serverless configuration
│   │   ├── defineChallenge
│   │   │   ├── handler.ts      # `DefineChallenge` lambda source code
│   │   │   ├── index.ts        # `DefineChallenge` lambda Serverless configuration
│   │   ├── verifyAuthChallenge
│   │   │   ├── handler.ts      # `VerifyAuthChallenge` lambda source code
│   │   │   ├── index.ts        # `VerifyAuthChallenge` lambda Serverless configuration
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│   └── schema.ts               # cpf schema validator
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```


### Advanced usage

Any tsconfig.json can be used, but if you do, set the environment variable `TS_NODE_CONFIG` for building the application, eg `TS_NODE_CONFIG=./tsconfig.app.json npx serverless webpack`
