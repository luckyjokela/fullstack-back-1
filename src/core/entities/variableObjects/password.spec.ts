import { Password } from './Password';

const mockHasher = {
  hash: jest.fn().mockReturnValue('hashed_password_123'),
  compare: jest.fn().mockReturnValue(true),
};

describe('Password', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should fail if password is less than 8 characters', () => {
      const result = Password.create('1234567', mockHasher);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          'Password must be at least 8 characters long',
        );
      }
      expect(mockHasher.hash).not.toHaveBeenCalled();
    });

    it('should fail if password is too weak', () => {
      jest.mock('zxcvbn', () => () => ({ score: 2 }));

      const result = Password.create('12345678', mockHasher);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Password is too weak');
      }
      expect(mockHasher.hash).not.toHaveBeenCalled();
    });

    it('should create password if valid', () => {
      const result = Password.create('StrongPass123!', mockHasher);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.getValue()).toBe('hashed_password_123');
      }
      expect(mockHasher.hash).toHaveBeenCalledWith('StrongPass123!');
    });
  });

  describe('fromHash', () => {
    it('should fail if hash is invalid', () => {
      const result = Password.fromHash('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Invalid password hash');
      }
    });

    it('should fail if hash is not a bcrypt hash', () => {
      const result = Password.fromHash('not-a-bcrypt-hash');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Invalid password hash');
      }
    });

    it('should create password from valid hash', () => {
      const validHash = '$2b$10$abcdefghijklmnopqrstuvwxyzabcdefghijklmno';
      const result = Password.fromHash(validHash);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.getValue()).toBe(validHash);
      }
    });
  });
});
