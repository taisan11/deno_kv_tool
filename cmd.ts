import {blue} from "@std/fmt/colors"

export async function list(kv:Deno.Kv,pre?:string[]):Promise<void> {
    const p:string[] = pre ?? [];
    const list = kv.list({prefix:p});
    for await (const e of list) {
        console.log(blue(e.key.toString())," : ",e.value);
    }
}

export async function remove(kv:Deno.Kv, key: string[]): Promise<void> {
    await kv.delete(key);
}