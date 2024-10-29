import {
  JobQueueSchema,
  JobQueueTask,
} from 'src/job-queue/job-queue.constants';
import { User } from './user.schema';
import { z } from 'zod';
import { VerificationCode } from 'src/verification/verification.schema';

export const UserRegisteredEventSchema = JobQueueSchema.extend({
  payload: z.object({
    email: z.string().email(),
    code: z.string().uuid(),
  }),
});

export const UserVerifiedEventSchema = UserRegisteredEventSchema;

export function createUserRegisterEvent(
  user: User,
  code: VerificationCode,
): z.infer<typeof UserRegisteredEventSchema> {
  return {
    type: JobQueueTask.USER_REGISTERED,
    payload: {
      email: user.email,
      code: code.code,
    },
  };
}

export function createUserVerifiedEvent(
  user: User,
  code: string,
): z.infer<typeof UserVerifiedEventSchema> {
  return {
    type: JobQueueTask.USER_VERIFIED,
    payload: {
      email: user.email,
      code: code,
    },
  };
}
