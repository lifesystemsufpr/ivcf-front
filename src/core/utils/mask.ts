export type InputMaskType =
  | "cpf"
  | "cnpj"
  | "phone"
  | "currency"
  | "plate"
  | "renavam"
  | "rntrc"
  | "crlv"
  | "cep"
  | "cnh";

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCPF(value: string) {
  const v = onlyDigits(value).slice(0, 11);
  return v
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatCNPJ(value: string) {
  const v = onlyDigits(value).slice(0, 14);
  return v
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function formatPhone(value: string) {
  const v = onlyDigits(value).slice(0, 11);
  return v.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

export function formatCurrency(value: string) {
  const digits = onlyDigits(value);
  const number = (Number(digits) / 100).toFixed(2);
  return number.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatPlate(value: string) {
  const v = value
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 7);

  if (v.length > 3) {
    return `${v.slice(0, 3)}-${v.slice(3)}`;
  }

  return v;
}

export function formatRenavam(value: string) {
  const v = onlyDigits(value).slice(0, 11);

  return v
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{6})(\d)/, "$1.$2.$3");
}

export function formatRNTRC(value: string) {
  const v = onlyDigits(value).slice(0, 8);

  return v
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
}

export function formatCRLV(value: string) {
  const v = onlyDigits(value).slice(0, 11);

  return v
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
}

export function formatCEP(value: string) {
  const v = onlyDigits(value).slice(0, 8);
  return v.replace(/^(\d{5})(\d)/, "$1-$2");
}

export function formatCNH(value: string) {
  return onlyDigits(value).slice(0, 11);
}

export function applyMask(value: string, mask?: InputMaskType) {
  if (!mask) return value;

  switch (mask) {
    case "cpf":
      return formatCPF(value);
    case "cnpj":
      return formatCNPJ(value);
    case "phone":
      return formatPhone(value);
    case "currency":
      return formatCurrency(value);
    case "plate":
      return formatPlate(value);
    case "renavam":
      return formatRenavam(value);
    case "rntrc":
      return formatRNTRC(value);
    case "crlv":
      return formatCRLV(value);
    case "cep":
      return formatCEP(value);
    case "cnh":
      return formatCNH(value);
    default:
      return value;
  }
}
