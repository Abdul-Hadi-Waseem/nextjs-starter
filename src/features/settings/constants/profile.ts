// Zod-free, so client components can read the limits without pulling in the schema.
export const PROFILE_NAME_LENGTH = { MIN: 2, MAX: 80 } as const;
