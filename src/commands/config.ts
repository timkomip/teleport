import { findConfigPath } from "../config.ts";

export async function configCommand(): Promise<void> {
  const path = await findConfigPath();
  console.log(path);
}
