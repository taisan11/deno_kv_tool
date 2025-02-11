import { red,bold } from "@std/fmt/colors";

export function isURL(str: string): boolean {
    return URL.canParse(str);
}

export function toKey(key: string|number): Deno.KvKey {
    if (typeof key === "number") throw new Error("Invalid key format");
    try {
        return JSON.parse(key);
    } catch (_e: unknown) {
        console.log(red(bold("Invalid key format")));
        throw new Error("Invalid key format");
    }
}

export function toValue(value: string|number): string | number | object {
    if (typeof value === "number") return value;
    try {
        return JSON.parse(value);
    } catch (_e: unknown) {
        if (!isNaN(Number(value))) {
            return Number(value);
        } else if (typeof value === "string") {
            return value;
        } else {
            console.log(red(bold("Invalid value format")));
            throw new Error("Invalid value format");
        }
    }
}