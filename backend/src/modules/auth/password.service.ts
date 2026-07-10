import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  compare(plainText: string, passwordHash: string) {
    return bcrypt.compare(plainText, passwordHash);
  }
}
