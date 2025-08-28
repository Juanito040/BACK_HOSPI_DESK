import { Question } from "./../../../node_modules/inquirer/dist/commonjs/types.d";
import "colors";
import inquirer from "inquirer";

export const inquirerMenu = async (message: string, questions: any) => {
  console.clear();
  console.log("Bienvenido".bgBlack.white.bold);
  console.log("\n");
  const { option } = await inquirer.prompt(questions);

  return option;
};

export const inquirerPause = async () => {
  console.log("\n");
  await inquirer.prompt([
    {
      type: "input",
      name: "option",
      message: `Pulsa ${"Enter".green} para continuar`,
    },
  ]);
};
export const inquirerReadInput = async (message: string) => {
  const { description } = await inquirer.prompt([
    {
      type: "input",
      name: "description",
      message,
      validate(value) {
        return value.length ? true : "Por favor ingrese un valor";
      },
    },
  ]);
  return description;
};
