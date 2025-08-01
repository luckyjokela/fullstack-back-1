import { Result } from 'src/core/shared/types/Result.type';
import { v4 as uuid4 } from 'uuid';

export class Id {
  private readonly _value: string;

  private constructor(value?: string) {
    this._value = value ?? uuid4();
  }

  static create(): Result<Id> {
    return { success: true, data: new Id() };
  }

  static fromString(value: string): Result<Id> {
    if (!value || typeof value !== 'string') {
      return { success: false, error: 'Invalid ID value' };
    }
    return { success: true, data: new Id(value) };
  }

  getValue(): string {
    return this._value;
  }
}
