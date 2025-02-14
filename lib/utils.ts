import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatAddress = (inputString: string, lengthSlice: number): string => {
  if (inputString.length <= 8) return inputString;

  const firstPart = inputString.slice(0, lengthSlice);
  const lastPart = inputString.slice(-lengthSlice);
  return `${firstPart}…${lastPart}`;
}

export const formatPercent = (value: number | null) => {
  return value ? `${value.toFixed(2)}%` : "N/A";
};

export function formatBigNumber(value: number) {
  const zero =  "0".repeat(value);
  return parseInt("1"+zero)
}

export const formatCurrency = (value: number | null) => {
  if (value === null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const bigIntSerializer = {
  serialize: (value: unknown): string => {
    if (typeof value === "bigint") {
      return value.toString()
    }
    if (Array.isArray(value)) {
      return JSON.stringify(value, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
    }
    return JSON.stringify(value)
  },
  parse: (value: string): unknown => {
    return JSON.parse(value, (_, v) => {
      if (typeof v === "string" && /^\d+n$/.test(v)) {
        return BigInt(v.slice(0, -1))
      }
      return v
    })
  }
}

export const serializeBigInt = (obj: unknown): unknown => {
  if (typeof obj === "bigint") {
      return obj.toString();
  }
  
  if (Array.isArray(obj)) {
      return obj.map(serializeBigInt);
  }
  
  if (obj && typeof obj === "object") {
      return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
      );
  }
  
  return obj;
};

export function convertBigIntToNumber(bigIntValue: bigint): number {
  return Number(bigIntValue) / 1_000_000;
}

export const formatNumberWithDots = (value?: number): string => {
  if (value === undefined || value === null || value === 0) return "0";
  const isDecimal = !Number.isInteger(value);
  const formattedValue = isDecimal ? value.toFixed(2) : value.toString();
  return formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}