import { inquirerPause, inquirerReadInput, inquirerMenu } from "./../helpers/inquirer";
import ScoreBoardService from "../../domain/services/scoreboard.service";
import { playerQuestions } from "./options/playerMenu"; // 

class PlayerController {
  constructor(private readonly scoreBoardService: ScoreBoardService) {}

  async run(): Promise<void> {
    let option = "";

    do {
      option = await inquirerMenu("Gestión de jugadores", playerQuestions);

      switch (option) {
        case "addPlayer":
          await this.handleAddPlayer();
          break;

        case "deletePlayer":
          await this.handleDeletePlayer();
          break;

        case "updateScore":
          await this.handleUpdateScore();
          break;

        case "listPlayers":
          await this.handleShowPlayers();
          break;

        case "back":
          console.log(">>>>> Volviendo al menú principal...");
          break;
      }
    } while (option !== "back");
    
  }

  private async handleAddPlayer() {
    try {
      const name = await inquirerReadInput("> Nombre del jugador: ");
      const score = Number(await inquirerReadInput("> Puntaje del jugador: "));

      if (isNaN(score)) {
        console.error("Puntaje inválido. Debe ser un número.");
        return;
      }

      this.scoreBoardService.addPlayer(name, score);
      console.log("Jugador agregado con éxito.");
    } catch (error) {
      console.error("Ha ocurrido un error:", error);
    }
    await inquirerPause();
  }

  private async handleDeletePlayer() {
    const name = await inquirerReadInput("> Nombre del jugador: ");

    try {
      this.scoreBoardService.removePlayer(name);
      console.log("Jugador eliminado.");
    } catch (error) {
      console.error("Ocurrió un error:", error);
    }

    await inquirerPause();
  }

  private async handleUpdateScore() {
    try {
      const name = await inquirerReadInput("> Nombre del jugador: ");
      const score = Number(await inquirerReadInput("> Nuevo puntaje del jugador: "));

      this.scoreBoardService.updateScore(name, score);
      console.log(`Puntaje del jugador actualizado: ${name}`);
    } catch (error) {
      console.error("Ha ocurrido un error:", error);
    }
    await inquirerPause();
  }

  private async handleShowPlayers() {
    try {
      const players = this.scoreBoardService.getSorted();

      !players.length
        ? console.log("No hay participantes registrados.")
        : console.table(players);
    } catch (error) {
      console.error("Ocurrió un error:", error);
    }

    await inquirerPause();
  }
}

export default PlayerController;
