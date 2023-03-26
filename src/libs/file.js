import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { outro } from "@clack/prompts";
import util from "util";

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

    return content.toString();
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
 * @param {String} content
 * @param {String} nameFile
 * @param {String} nameApp
 */
export const createFile = (content, nameFile, nameApp) => {
  const generatedPath = path.join(process.cwd(), "/generated");

  //   Verify if the directory exists
  if (!fs.existsSync(generatedPath)) fs.mkdirSync(generatedPath);

  //   Creating file
  fs.writeFileSync(path.join(generatedPath, `/${nameFile}`), content);
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
