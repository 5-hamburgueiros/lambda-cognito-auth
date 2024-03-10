import { middyfy } from '@libs/lambda';

const handle = async (event) => {
  event.response.autoConfirmUser = true;
  return event;
};

export const main = middyfy(handle);
