import { fail, type ActionFailure } from '@sveltejs/kit';
import { isIsoDate } from '../domain/dates.ts';

/** Thrown by the field parsers; turned into a 400 response by the actions. */
export class FormError extends Error {}

export function text(form: FormData, name: string): string | null {
	const value = form.get(name);
	if (typeof value !== 'string') return null;
	const trimmed = value.trim();
	return trimmed === '' ? null : trimmed;
}

export function requiredText(form: FormData, name: string, label: string): string {
	const value = text(form, name);
	if (value === null) throw new FormError(`Le champ « ${label} » est obligatoire.`);
	return value;
}

export function int(form: FormData, name: string, label: string): number | null {
	const value = text(form, name);
	if (value === null) return null;
	const n = Number(value);
	if (!Number.isInteger(n)) throw new FormError(`« ${label} » doit être un nombre entier.`);
	return n;
}

export function requiredInt(form: FormData, name: string, label: string): number {
	const n = int(form, name, label);
	if (n === null) throw new FormError(`Le champ « ${label} » est obligatoire.`);
	return n;
}

/** Accepts both '3.5' and '3,5'. */
export function decimal(form: FormData, name: string, label: string): number | null {
	const value = text(form, name);
	if (value === null) return null;
	const n = Number(value.replace(',', '.'));
	if (!Number.isFinite(n)) throw new FormError(`« ${label} » doit être un nombre.`);
	return n;
}

export function date(form: FormData, name: string, label: string): string | null {
	const value = text(form, name);
	if (value === null) return null;
	if (!isIsoDate(value)) throw new FormError(`« ${label} » n'est pas une date valide.`);
	return value;
}

export function requiredDate(form: FormData, name: string, label: string): string {
	const value = date(form, name, label);
	if (value === null) throw new FormError(`Le champ « ${label} » est obligatoire.`);
	return value;
}

export function bool(form: FormData, name: string): boolean {
	const value = form.get(name);
	return value === 'on' || value === 'true' || value === '1';
}

export function oneOf<T extends string>(
	form: FormData,
	name: string,
	allowed: readonly T[],
	label: string
): T {
	const value = text(form, name);
	if (value === null || !(allowed as readonly string[]).includes(value)) {
		throw new FormError(`Valeur invalide pour « ${label} ».`);
	}
	return value as T;
}

/** Non-empty uploaded files of a multi-file input. */
export function files(form: FormData, name: string): File[] {
	return form
		.getAll(name)
		.filter((f): f is File => typeof f === 'object' && f !== null && 'size' in f && f.size > 0);
}

/** Plain object of the submitted values, to refill the form after an error. */
export function values(form: FormData): Record<string, string> {
	const out: Record<string, string> = {};
	for (const [key, value] of form.entries()) if (typeof value === 'string') out[key] = value;
	return out;
}

/**
 * Run a form action body: field errors (FormError) become a 400 response that
 * carries the error message and the submitted values. Anything else (including
 * SvelteKit redirects) propagates.
 */
export async function withForm<T>(
	request: Request,
	body: (form: FormData) => T | Promise<T>
): Promise<T | ActionFailure<{ error: string; values: Record<string, string> }>> {
	const form = await request.formData();
	try {
		return await body(form);
	} catch (e) {
		if (e instanceof FormError) return fail(400, { error: e.message, values: values(form) });
		throw e;
	}
}
