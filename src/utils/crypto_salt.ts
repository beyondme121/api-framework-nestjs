import * as crypto from 'crypto';

export function makeSalt(): string {
  return crypto.randomBytes(10).toString('base64');
}

export function encryptPassword(password: string, salt: string): string {
  if (!password || !salt) {
    return '';
  }
  const tempSalt = Buffer.from(salt, 'base64');
  return crypto
    .pbkdf2Sync(password, tempSalt, 10000, 16, 'sha1')
    .toString('base64');
}

export function checkPassword(password, user) {
  const hashedPwd = user.password;
  const salt = user.salt;
  const hashClientPwd = encryptPassword(password, salt);
  if (hashedPwd === hashClientPwd) {
    return true;
  }
  return false;
}
