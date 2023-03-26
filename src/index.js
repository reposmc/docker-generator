import { intro, isCancel, outro, select, text } from "@clack/prompts";
import colors from "picocolors";
import { typeApplications } from "./libs/application.js";
import { createFile, readContentFile, setContentInFile } from "./libs/file.js";
import { exitProgram } from "./libs/utils.js";
import { validateText } from "./libs/validation.js";

// Welcome message
intro(
  colors.blue(
    `🚀 Asistente para la creación de archivos de docker compose - ${colors.yellow(
      "Ministerio de Cultura"
    )}`
  )
);

outro(
  `${colors.red("⚠️  NOTA: ")} ${colors.yellow(
    "Este script creará una serie de carpetas y archivos para contenerizar una aplicación con Docker."
  )}`
);

// Requesting type proyect
const typeApp = await select({
  message: colors.cyan("Selecciona el tipo de proyecto: "),
  options: typeApplications(),
});

if (isCancel(typeApp)) exitProgram();

// Requesting name project
const nameApp = await text({
  message: colors.cyan("Ingresa el nombre del proyecto:"),
  validate: (value) => validateText(value, 50),
});

if (isCancel(nameApp)) exitProgram();

// Creating the files depending on the type of project
switch (typeApp) {
  case "laravel":
    // Requesting subdomain
    const subDomain = await text({
      message: colors.cyan("Ingresa el subdominio:"),
      validate: (value) => validateText(value, 50),
    });

    if (isCancel(subDomain)) exitProgram();

    const nameFiles = [
      "docker-compose.yml",
      "nginx.conf",
      "composer.dockerfile",
      "nginx.dockerfile",
      "php.dockerfile",
    ];

    const valuesToReplace = [
      {
        field: "nameApp",
        value: nameApp,
      },
      {
        field: "subDomain",
        value: subDomain,
      },
    ];

    nameFiles.forEach(async (nameFile) => {
      let content = await readContentFile(nameFile, typeApp);
      content = await setContentInFile(content, valuesToReplace);
      await createFile(content, nameFile, nameApp);

      await outro(
        colors.green(
          `✔️  ${colors.yellow(nameFile)} fue generado correctamente.`
        )
      );
    });

    break;
}
