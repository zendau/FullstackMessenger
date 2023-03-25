import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT));
}

export async function comparePassword(password: string, hash: string) {
  const resCompare = await bcrypt.compare(password, hash);

  if (!resCompare)
    return {
      status: false,
      message: 'error.incorrectPassword',
      httpCode: HttpStatus.BAD_REQUEST,
    };

  return {
    status: true,
  };
}
