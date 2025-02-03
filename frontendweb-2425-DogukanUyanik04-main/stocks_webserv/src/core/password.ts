// src/core/password.ts
import config from 'config'; // 👈 1
import argon2 from 'argon2'; // 👈 2

// 👇 1
const ARGON_HASH_LENGTH = config.get<number>('auth.argon.hashLength');
const ARGON_TIME_COST = config.get<number>('auth.argon.timeCost');
const ARGON_MEMORY_COST = config.get<number>('auth.argon.memoryCost');

// 👇 3
export const hashPassword = async (password: string): Promise<string> => {
  // 👇 4
  return argon2.hash(password, {
    type: argon2.argon2id,
    hashLength: ARGON_HASH_LENGTH,
    timeCost: ARGON_TIME_COST,
    memoryCost: ARGON_MEMORY_COST,
  });
};

// 👇 5
export const verifyPassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  // 👇 6
  return argon2.verify(passwordHash, password);
};
