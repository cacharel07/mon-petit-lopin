import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password.ts';

describe('password hashing', () => {
	it('verifies the right password and rejects a wrong one', async () => {
		const hash = await hashPassword('pommier');
		expect(hash).toMatch(/^scrypt:[0-9a-f]+:[0-9a-f]+$/);
		expect(await verifyPassword('pommier', hash)).toBe(true);
		expect(await verifyPassword('poirier', hash)).toBe(false);
	});

	it('rejects malformed hashes', async () => {
		expect(await verifyPassword('x', 'nope')).toBe(false);
	});
});
