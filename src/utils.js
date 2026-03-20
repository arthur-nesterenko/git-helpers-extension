export function stripDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function splitWords(str) {
  return stripDiacritics(str)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

export function toSnakeCase(str) {
  return splitWords(str).join("_");
}

export function toKebabCase(str) {
  return splitWords(str).join("-");
}

export function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function truncate(str, maxLength) {
  return str.slice(0, maxLength);
}
