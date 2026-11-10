import { n as fail } from "./exports.js";
import { f as isIsoDate } from "./dates.js";
// src/lib/server/forms.ts
/** Thrown by the field parsers; turned into a 400 response by the actions. */
var FormError = class extends Error {};
function text(form, name) {
	const value = form.get(name);
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed === "" ? null : trimmed;
}
function requiredText(form, name, label) {
	const value = text(form, name);
	if (value === null) throw new FormError(`Le champ « ${label} » est obligatoire.`);
	return value;
}
function int(form, name, label) {
	const value = text(form, name);
	if (value === null) return null;
	const n = Number(value);
	if (!Number.isInteger(n)) throw new FormError(`« ${label} » doit être un nombre entier.`);
	return n;
}
function requiredInt(form, name, label) {
	const n = int(form, name, label);
	if (n === null) throw new FormError(`Le champ « ${label} » est obligatoire.`);
	return n;
}
/** Accepts both '3.5' and '3,5'. */
function decimal(form, name, label) {
	const value = text(form, name);
	if (value === null) return null;
	const n = Number(value.replace(",", "."));
	if (!Number.isFinite(n)) throw new FormError(`« ${label} » doit être un nombre.`);
	return n;
}
function date(form, name, label) {
	const value = text(form, name);
	if (value === null) return null;
	if (!isIsoDate(value)) throw new FormError(`« ${label} » n'est pas une date valide.`);
	return value;
}
function requiredDate(form, name, label) {
	const value = date(form, name, label);
	if (value === null) throw new FormError(`Le champ « ${label} » est obligatoire.`);
	return value;
}
function bool(form, name) {
	const value = form.get(name);
	return value === "on" || value === "true" || value === "1";
}
function oneOf(form, name, allowed, label) {
	const value = text(form, name);
	if (value === null || !allowed.includes(value)) throw new FormError(`Valeur invalide pour « ${label} ».`);
	return value;
}
/** Non-empty uploaded files of a multi-file input. */
function files(form, name) {
	return form.getAll(name).filter((f) => typeof f === "object" && f !== null && "size" in f && f.size > 0);
}
/** Plain object of the submitted values, to refill the form after an error. */
function values(form) {
	const out = {};
	for (const [key, value] of form.entries()) if (typeof value === "string") out[key] = value;
	return out;
}
/**
* Run a form action body: field errors (FormError) become a 400 response that
* carries the error message and the submitted values. Anything else (including
* SvelteKit redirects) propagates.
*/
async function withForm(request, body) {
	const form = await request.formData();
	try {
		return await body(form);
	} catch (e) {
		if (e instanceof FormError) return fail(400, {
			error: e.message,
			values: values(form)
		});
		throw e;
	}
}
export { files as a, requiredDate as c, text as d, withForm as f, decimal as i, requiredInt as l, bool as n, int as o, date as r, oneOf as s, FormError as t, requiredText as u };

//# sourceMappingURL=forms.js.map