import { Result } from '../../shared/types/Result.type';

export class Username {
  constructor(private readonly value: string) {
    if (value == null) throw new Error('Invalid Username');
  }

  static create(value: string): Result<Username> {
    if (!value || value.trim().length < 3 || value.length > 30) {
      return { success: false, error: 'Username must be 3-30 characters long' };
    }

    const isValid = /^[a-zA-Z0-9_.-]+$/.test(value);
    if (!isValid) {
      return { success: false, error: 'Username contains invalid characters' };
    }

    return { success: true, data: new Username(value) };
  }

  getValue(): string {
    return this.value;
  }
}

export class Name {
  constructor(private readonly value: string) {}

  static create(value: string): Result<Name> {
    if (!value || value.trim().length < 2 || value.length > 50) {
      return { success: false, error: 'Name must be 2-50 characters long' };
    }

    return { success: true, data: new Name(value) };
  }

  getValue(): string {
    return this.value;
  }
}

export class MiddleName {
  constructor(private readonly value: string) {}

  static create(value: string): Result<MiddleName> {
    if (!value || value.trim().length < 2 || value.length > 50) {
      return {
        success: false,
        error: 'MiddleName must be 2-50 characters long',
      };
    }

    return { success: true, data: new MiddleName(value) };
  }

  getValue(): string {
    return this.value;
  }
}

export class Surname {
  constructor(private readonly value: string) {}

  static create(value: string): Result<Surname> {
    if (!value || value.trim().length < 2 || value.length > 50) {
      return { success: false, error: 'Surname must be 2-50 characters long' };
    }

    return { success: true, data: new Surname(value) };
  }

  getValue(): string {
    return this.value;
  }
}
