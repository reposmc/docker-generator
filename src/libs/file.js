/**
 * Autor: Leonel López
 * E-mail: lalopez@cultura.gob.sv
 * Fecha: 26/03/2023
 */

import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { outro } from "@clack/prompts";
import { exit } from "process";
import colors from "picocolors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Read the file contents.
 *
 * @param {String} nameFile
 * @param {String} typeApp
 * @param {Array} valuesToReplace
 */
export const readContentFile = async (nameFile, typeApp) => {
  const directoryPath = path.join(__dirname, `../assets/${typeApp}`);

  //   Getting all the files in the directory
  const files = readAllFilesInDirectory(directoryPath);

  //   Get the file to read
  const filesFound = files.filter((file) => file.includes(nameFile));

  if (filesFound.length > 0) {
    // Get the file contents
    let content = await fs.promises.readFile(filesFound[0]);

    const path = filesFound[0].split(typeApp);
    if (path.length > 2) {
      outro(
        colors.red(
          `🛑  Error: Existe más de una carpeta o archivo con el nombre de ${colors.yellow(
            "laravel-gen"
          )}, esta es una palabra reservada del script`
        )
      );

      exit(1);
    }

    return {
      path: path[1],
      content: content.toString(),
    };
  }
};

/**
 * Replaces all the occurrences.
 *
 * @param {String} content
 * @param {Array<Object>} valuesToReplace
 * @returns String
 */
export const setContentInFile = (content, valuesToReplace) => {
  valuesToReplace.forEach(({ field, value }) => {
    content = content.replaceAll(`{{${field}}}`, value);
  });

  return content;
};

/**
 * Creates the from the name file and the content has been replaced in the template.
 *
 * @param {Object} content
 * @param {String} nameFile
 * @param {String} nameApp
 */
export const createFile = (file, nameFile, nameApp) => {
  const nameFileGenerated = nameFile.replaceAll(".stub", "");
  const pathStubs = file.path.replaceAll(".stub", "");
  const generatedPath = path.join(`${process.cwd()}/${pathStubs}/..`);

  //   Verify if the directory exists
  if (!fs.existsSync(generatedPath))
    fs.mkdirSync(generatedPath, { recursive: true }, (err) => {
      if (err) throw err;
    });

  //   Creating file
  fs.writeFileSync(
    path.join(generatedPath, `/${nameFileGenerated}`),
    file.content
  );
};

/**
 * Gets a directory and its files.
 *
 * @param {String} directoryPath
 * @returns
 */
const readAllFilesInDirectory = (directoryPath) => {
  let files = [];

  // Reading the directory
  const list = fs.readdirSync(directoryPath);

  list.forEach((file) => {
    file = `${directoryPath}/${file}`;

    const stat = fs.statSync(file);

    if (stat && stat.isDirectory()) {
      // Recurse into a subdirectory
      files = files.concat(readAllFilesInDirectory(file));
    } else {
      // Is a file
      files.push(file);
    }
  });

  return files;
};
