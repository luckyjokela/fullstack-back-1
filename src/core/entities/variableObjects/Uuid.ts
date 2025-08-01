import { v4 as uuids4 } from 'uuid';
import { z } from 'zod';

const uuidSchema = z.string().uuid();

export class Uuid {
  private readonly _value: string;

  private constructor(value?: string) {
    const parsed = value ? uuidSchema.parse(value) : uuids4();
    this._value = parsed;
  }

  getValue(): string {
    return this._value;
  }

  static isValid(value: string): boolean {
    return uuidSchema.safeParse(value).success;
  }
}
