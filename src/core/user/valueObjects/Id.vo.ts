import { v4 as uuidv4 } from 'uuid';

export class Id {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? uuidv4(); 
  }

  getValue(): string {
    return this._value;
  }
}