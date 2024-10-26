import { User } from './user.schema';

export async function createUserRegisterEvent(user: User) {
  return {
    type: 'USER_REGISTERED',
    payload: {
      id: user.id.toString(),
    },
  };
}

export async function createUserVerifiedEvent(user: User) {
  return {
    type: 'USER_VERIFIED',
    payload: {
      id: user.id.toString(),
    },
  };
}
