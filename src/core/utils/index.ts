import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// O client HTTP rejeita com um objeto ApiError simples, e nao com uma instancia
// de Error, entao os dois formatos precisam ser tratados aqui.
export function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "message" in error) {
    const { message } = error as { message?: unknown };
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

export function formatDateTime(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export function formatDate(dateString: string, useUTC: boolean = false) {
  const date = new Date(dateString);

  if (useUTC) {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "UTC",
    }).format(date);
  }

  return date.toLocaleDateString("pt-BR");
}

export function formatPhone(phone: string | null) {
  if (!phone) return "Sem telefone";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export async function fetchAddressByCep(cep: string) {
  const cleanCep = cep.replace(/\D/g, "");

  if (cleanCep.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (data.erro) return;

    return data;
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
  }
}

export function extractAgeFromBirthDate(
  birthDate: string | undefined | null,
): number | null {
  if (!birthDate) return null;

  const today = new Date();

  const [year, month, day] = birthDate.split("T")[0].split("-").map(Number);
  const birth = new Date(year, month - 1, day); // <-- sem UTC

  let age = today.getFullYear() - birth.getFullYear();

  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
