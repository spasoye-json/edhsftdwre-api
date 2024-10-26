import { User } from './user.schema';

export function createUserRegisterEvent(user: User) {
  return {
    type: 'USER_REGISTERED',
    payload: {
      id: user.id.toString(),
    },
  };
}

export function createUserVerifiedEvent(user: User) {
  return {
    type: 'USER_VERIFIED',
    payload: {
      id: user.id.toString(),
    },
  };
}
