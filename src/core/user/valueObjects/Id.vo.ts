import { v4 as uuid4 } from 'uuid';

export class Id {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? uuid4();
  }

  getValue(): string {
    return this._value;
  }
}
