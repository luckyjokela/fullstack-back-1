// password.spec.ts
import { Password } from './Password';
import * as bcrypt from 'bcrypt';

const mockHasher = {
  hash: jest.fn().mockImplementation((pass) => bcrypt.hashSync(pass, 10)),
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
      const result = Password.create('12345678', mockHasher);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Password must contain a lowercase letter');
      }
    });

    it('should create password if valid', async () => {
      jest.mock('zxcvbn', () => () => ({ score: 4 }));

      const result = Password.create('StrongPass123!', mockHasher);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.getValue()).toBeTruthy();
        expect(
          await bcrypt.compare('StrongPass123!', result.data.getValue()),
        ).toBe(true);
      }
    });
  });

  describe('fromHash', () => {
    it('should create password from valid hash', async () => {
      const validHash = await bcrypt.hash('test123', 10);
      const result = Password.fromHash(validHash);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.getValue()).toBe(validHash);
      }
    });
  });
});
