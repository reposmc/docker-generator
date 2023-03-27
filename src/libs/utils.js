/**
 * Autor: Leonel López
 * E-mail: lalopez@cultura.gob.sv
 * Fecha: 26/03/2023
 */

import { outro } from "@clack/prompts";
import colors from "picocolors";

export function exitProgram({
  code = 0,
  message = "🔚 Fin del programa.",
} = {}) {
  outro(colors.yellow(message));
  process.exit(code);
}
