import argon2 from 'argon2';

// OWASP minimum Argon2id profile: 19 MiB memory, 2 iterations, 1 lane.
const OPTIONS = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 };

export const hashPassword = (plain) => argon2.hash(plain, OPTIONS);

export async function verifyPassword(hash, plain) {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    return false;
  }
}

export const needsRehash = (hash) => argon2.needsRehash(hash, OPTIONS);

let dummyHash;
/** Spend about the same time as a real check, so response time doesn't reveal whether an email exists. */
export async function burnPasswordCheck(plain) {
  dummyHash ??= await hashPassword('timing-equaliser-password');
  await verifyPassword(dummyHash, plain);
}
