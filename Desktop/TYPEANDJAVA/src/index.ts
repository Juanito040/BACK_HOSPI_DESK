import ScoreBoardService from "./domain/services/scoreboard.service";
import MainController from "./infrastructure/cli/options/main.controller";
import PlayerController from "./infrastructure/cli/player.controller";
import inMemoryScoreBoardRepository from "./infrastructure/persistence/in-memory-scoreboard.repository";

const repo = new inMemoryScoreBoardRepository()
const service = new ScoreBoardService(repo)

const playerMenu = new PlayerController(service)
const mainMenu = new MainController(service, playerMenu)

mainMenu.run()