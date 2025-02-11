import {parseArgs} from "@std/cli"
import {red,bold} from "@std/fmt/colors"
import {isURL, toKey, toValue} from "./until.ts"
import { list } from "./cmd.ts";

let kv = await Deno.openKv()
const env = Deno.env

while (true) {
  const input = prompt("Deno KV>");
  if (input === "exit") break;
  const args = parseArgs(input?.split(" ") || []);
  if (args._.length === 0) {
    console.log("No command entered");
    continue;
  }
  const command = args._[0];
  switch (command) {
    case "APIset": {
      if (isURL(args._[1] as string)&&!env.has("DENO_KV_ACCESS_TOKEN")) {
        console.log(red(bold("API key is not set. You need to set the API key to access Deno Deploy KV.")));
        break;
      }
      const openhere = args._[1] as string;
      kv = await Deno.openKv(openhere);
      break;
    }
    case "get": {
      const key = toKey(args._[1]);
      const value = await kv.get(key);
      console.log(value);
      break;
    }
    case "set": {
      const key = toKey(args._[1]);
      const value = toValue(args._[2]);
      await kv.set(key, value);
      console.log("Set value");
      break;
    }
    case "ls":{
      if (typeof args._[1] === "string") {
      const p = JSON.parse(args._[1] as string);
      await list(kv, p);
      }
      await list(kv);
      break;
    }
    case "list":{
      if (typeof args._[1] === "string") {
        const p = JSON.parse(args._[1] as string);
        await list(kv, p);
      }
      await list(kv);
      break;
    }
    case "remove": {
      const key = toKey(args._[1]);
      await kv.delete(key);
      break;
    }
    case "rm": {
      const key = toKey(args._[1]);
      await kv.delete(key);
      break;
    }
    case "clear": {
      const yn = prompt("Are you sure you want to clear all data? (yes/no)");
      if (yn === "yes") {
        const list = kv.list({prefix: []})
        for await (const key of list) {
          await kv.delete(key.key);
        }
        console.log("Cleared all data");
      }
      break;
    }
    case "test":{
      console.log(toKey(args._[1] as string));
      break;
    }
    default:
      console.log(`Unknown command: ${command}`);
  }
}