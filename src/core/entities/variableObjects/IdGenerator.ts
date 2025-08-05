import { Result } from '../../../core/shared/types/Result.type';
import {
  v4 as uuid4,
  validate as isUuidValid,
  version as uuidVersion,
} from 'uuid';

export class Id {
  private readonly _value: string;

  private constructor(value?: string) {
    this._value = value ?? uuid4();
  }

  static create(): Result<Id> {
    return { success: true, data: new Id() };
  }

  static fromString(value: string): Result<Id> {
    if (!value || !isUuidValid(value) || uuidVersion(value) !== 4) {
      return { success: false, error: 'Invalid UUID format' };
    }
    return { success: true, data: new Id(value) };
  }

  getValue(): string {
    return this._value;
  }
}
