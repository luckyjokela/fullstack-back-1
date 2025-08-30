export class PasswordValidator {
  static validate(password: string): { success: boolean; error?: string } {
    if (!password || typeof password !== 'string') {
      return { success: false, error: 'Password is required' };
    }

    const trimmed = password.trim();

    if (trimmed.length === 0) {
      return {
        success: false,
        error: 'Password cannot be empty or whitespace',
      };
    }

    if (trimmed.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long',
      };
    }

    const hasLower = /[a-z]/.test(trimmed);
    const hasUpper = /[A-Z]/.test(trimmed);
    const hasNumber = /\d/.test(trimmed);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>[\]\\`~_+\-=]/.test(trimmed);

    if (!hasLower) {
      return {
        success: false,
        error: 'Password must contain a lowercase letter',
      };
    }
    if (!hasUpper) {
      return {
        success: false,
        error: 'Password must contain an uppercase letter',
      };
    }
    if (!hasNumber) {
      return { success: false, error: 'Password must contain a number' };
    }
    if (!hasSpecial) {
      return {
        success: false,
        error: 'Password must contain a special character',
      };
    }

    const isTooCommon = ['password', '12345678', 'qwerty123', 'admin123'].some(
      (word) => trimmed.toLowerCase().includes(word),
    );

    if (isTooCommon) {
      return { success: false, error: 'Password is too common or predictable' };
    }

    return { success: true };
  }
}
