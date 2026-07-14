import type { LocalizedText } from "@/lib/types";

export function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key);

  return value || null;
}

export function getNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(getString(formData, key));

  return Number.isFinite(value) ? value : fallback;
}

export function getBool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export function getLocalized(formData: FormData, baseKey: string): LocalizedText {
  const vi = getString(formData, `${baseKey}_vi`);
  const en = getString(formData, `${baseKey}_en`);
  const fallback = vi || en;

  return {
    vi: vi || fallback,
    en: en || fallback,
  };
}

export function getLines(formData: FormData, key: string) {
  return getString(formData, key)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getLocalizedLines(formData: FormData, baseKey: string) {
  const viLines = getLines(formData, `${baseKey}_vi`);
  const enLines = getLines(formData, `${baseKey}_en`);
  const maxLength = Math.max(viLines.length, enLines.length);

  return Array.from({ length: maxLength }, (_, index) => {
    const vi = viLines[index] ?? enLines[index] ?? "";
    const en = enLines[index] ?? viLines[index] ?? "";

    return { vi, en };
  }).filter((item) => item.vi || item.en);
}

export function getIngredientLines(formData: FormData, key: string) {
  return getLines(formData, key).map((line) => {
    const [name, ...amountParts] = line.split("|");

    return {
      name: name.trim(),
      amount: amountParts.join("|").trim(),
    };
  }).filter((item) => item.name);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
