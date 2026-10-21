import * as z from 'zod';
import { PROFILE_NAME_LENGTH } from '../constants/profile';

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(PROFILE_NAME_LENGTH.MIN, `Name must be at least ${PROFILE_NAME_LENGTH.MIN} characters`)
    .max(PROFILE_NAME_LENGTH.MAX, `Name must be at most ${PROFILE_NAME_LENGTH.MAX} characters`)
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
