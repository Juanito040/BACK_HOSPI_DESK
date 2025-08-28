import Player from "../../domain/entities/player";
import { ScoreBoardRepository } from "../../domain/repositories/scoreboard.repository";

/**
 * la clase inMemoryScoreBoardRepository corresponde a la implementacion del contrato
 * definido en la capa de dominio
 * 
 * Se implementa la logica de los metodos correspondientes a la gestion de los datos en memoria.
 * 
 * @author juan-ramirezm
 */

class inMemoryScoreBoardRepository implements ScoreBoardRepository {

    private players = new Map<string, Player>();

    /**
     * Guardo la instancia de un nuevo jugador en el Map,
     * usando la estructura de llave (nombre del jugador )-
     * valor (objeto tipo Player)
     * 
     * @param Player instancia del player
     * 
     */

    save(Player: Player): void {
        this.players.set(Player.name, Player);
    }

    /**
     * 
     * Busca en memoria un usuario cuyo nombre coincida en alguna de las keys
     * dentro del map. Si encuentra un valor, retorna la instancia Player, en caso de contrario retorna undefined.
     * 
     * @param name string: Nombre del player a constular
     * @returns instancia de player en caso de encontrarse, o undefined en caso contrario.
     * 
     */
    findByName(name: string): Player | undefined {
        return  this.players.get(name)
    }

    /**
     * retorna una copia con todos los valores que se encuentran 
     * en memoria
     * 
     * @returns un arreglo de Players
     */
    findAll(): Player[] {

        // Se usa el operador "rest" ("...") con la 
        // intencion de obtener una copia del arreglo 
        // de valores dentro del map, sin afectar 
        // los elementos originales

        return [...this.players.values()]
    }

    /**
     * Elimina una instancia dentro del map si coincide con el nombre solicitado.
     * 
     * @param name string: Nombre del usuario a eliminar
     * @returns True en caso de encontrarlo y eliminarlo, 
     * false en caso de que no se encuentre el valor en el Map
     */
    delete(name: string): boolean {
        return this.players.delete(name)
    }

}

export default inMemoryScoreBoardRepository