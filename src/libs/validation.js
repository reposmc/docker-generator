/**
 * Autor: Leonel López
 * E-mail: lalopez@cultura.gob.sv
 * Fecha: 26/03/2023
 */

import colors from "picocolors";

export const validateText = (value, length) => {
  if (value.length === 0) {
    return colors.red("El mensaje no puede estar vacío");
  }

  if (value.length > length) {
    return colors.red(`El mensaje no puede tener más de ${length} caracteres`);
  }
};
