import Player from "../entities/player"



export interface ScoreBoardRepository {

    save(Player: Player): void 
    findByName(name: string): Player | undefined
    // interseccion types; A | B -> Muestra A "0" muestra B
    // para el caso anterior, retorna player 

    findAll(): Player[]
    delete(name: string): boolean
}