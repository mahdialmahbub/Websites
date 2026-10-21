import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

/**
 * Password hashing with scrypt, which ships with Node.js (no native add-on to compile - important on Windows).
 * Parameters: N=2^15 (32 MiB), r=8, p=3 - one of the equivalent scrypt profiles recommended by OWASP.
 * Stored format:  scrypt$N$r$p$<salt>$<hash>   (base64url) - the parameters travel with the hash,
 * so they can be raised later and old hashes are upgraded on the next successful login.
 */
const scryptAsync = promisify(scrypt);

const PARAMS = Object.freeze({ N: 32768, r: 8, p: 3 });
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

// Sanity limits so a corrupted record can never make us allocate absurd amounts of memory.
const LIMITS = { N: 2 ** 20, r: 32, p: 16 };

const derive = (plain, salt, { N, r, p }, keyLength) =>
  // Normalising makes visually identical Unicode passwords compare equal.
  // maxmem: Node's default (32 MiB) is exactly what N=2^15, r=8 needs, so give it headroom.
  scryptAsync(plain.normalize('NFKC'), salt, keyLength, { N, r, p, maxmem: 128 * N * r * 2 });

function parse(hash) {
  const [scheme, N, r, p, salt, key] = String(hash).split('$');
  if (scheme !== 'scrypt' || !salt || !key) return null;

  const params = { N: Number(N), r: Number(r), p: Number(p) };
  const valid = Object.entries(params).every(([name, value]) => Number.isInteger(value) && value > 0 && value <= LIMITS[name]);
  if (!valid) return null;

  return { params, salt: Buffer.from(salt, 'base64url'), key: Buffer.from(key, 'base64url') };
}

export async function hashPassword(plain) {
  const salt = randomBytes(SALT_LENGTH);
  const key = await derive(plain, salt, PARAMS, KEY_LENGTH);
  return ['scrypt', PARAMS.N, PARAMS.r, PARAMS.p, salt.toString('base64url'), key.toString('base64url')].join('$');
}

export async function verifyPassword(hash, plain) {
  const parsed = parse(hash);
  if (!parsed) return false;
  try {
    const candidate = await derive(plain, parsed.salt, parsed.params, parsed.key.length);
    return candidate.length === parsed.key.length && timingSafeEqual(candidate, parsed.key);
  } catch {
    return false;
  }
}

/** true when the stored hash uses older/other parameters than the current ones. */
export function needsRehash(hash) {
  const parsed = parse(hash);
  return !parsed || parsed.params.N !== PARAMS.N || parsed.params.r !== PARAMS.r || parsed.params.p !== PARAMS.p;
}

let dummyHash;
/** Spend about the same time as a real check, so response time doesn't reveal whether an email exists. */
export async function burnPasswordCheck(plain) {
  dummyHash ??= await hashPassword('timing-equaliser-password');
  await verifyPassword(dummyHash, plain);
}
