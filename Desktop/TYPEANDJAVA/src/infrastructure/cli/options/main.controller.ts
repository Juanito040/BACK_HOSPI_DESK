import { Handler } from './../../../../node_modules/signal-exit/dist/mjs/index.d';
import ScoreBoardService from "../../../domain/services/scoreboard.service";
import { inquirerMenu, inquirerPause } from "../../helpers/inquirer";
import { principalQuestions } from "./principalMenu";
import PlayerController from '../player.controller';

class MainController {
    constructor(
        private readonly scoreBoardService: ScoreBoardService ,
        private readonly playerController: PlayerController
    ) {}
        async run(): Promise<void> {
            let option="";

            do {
                option = await inquirerMenu("Registro de puntuaciones", principalQuestions)

                switch (option) {
                    case "managePlayers":
                        await this.playerController.run()
                    break;

                    case "showScores"
                     : await this.HandlerShowScores()
                    break;

                    case "showLeader"
                    : await this.handleShowLeader()
                    break;

                    case "showPodium"
                     : await this.handlerShowPodium()
                    break;

                    case "0":
                    console.log(">>>>> saliendo de la aplicacion")
                    break;
                }
              

            }  while (option != '0');
        }

        private async  HandlerShowScores() {
            try {
                const players = this.scoreBoardService.getSorted()
                players.length
                ? console.table(players)
                : console.log("No hay participantes registrados")
            } catch (error) {
                console.error(`Error: ${error}`)
            }
            await inquirerPause()
        }
    private async handleShowLeader(){
        const leader = this.scoreBoardService.getLeader()
        console.log(leader ?? 'No hay participantes registrados')

        await inquirerPause()
    }

    private async handlerShowPodium(){
        const podium = this.scoreBoardService.getPodium()

    podium.length
        ? console.table(podium) 
        : console.log("No hay participantes registrados")

        await inquirerPause()
    }
}

export default MainController