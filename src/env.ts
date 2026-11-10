import { defineEnvVars } from '@sveltejs/kit/env';

const withDefault = (fallback: string) => (value: string | undefined) => value || fallback;

export const variables = defineEnvVars({
	DATABASE_URL: {
		description: 'Path to the SQLite database file.',
		schema: withDefault('data/lopin.db')
	},
	PHOTOS_DIR: {
		description: 'Directory where uploaded photos are stored.',
		schema: withDefault('data/photos')
	},
	ADMIN_USERNAME: {
		description: 'Login of the single account.',
		schema: withDefault('admin')
	},
	ADMIN_PASSWORD_HASH: {
		description: 'Password hash generated with `npm run hash-password`.',
		schema: (value) => {
			if (!value) throw new Error('ADMIN_PASSWORD_HASH is not set (run `npm run hash-password`)');
			return value;
		}
	}
});
