
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const uuidSchema = z.string().uuid();

export class Uuid {
  private readonly _value: string;

  constructor(value?: string) {
    const parsed = value ? uuidSchema.parse(value) : uuidv4();
    this._value = parsed;
  }

  getValue(): string {
    return this._value;
  }

  static isValid(value: string): boolean {
    return uuidSchema.safeParse(value).success;
  }
}