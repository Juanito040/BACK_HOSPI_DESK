import Player from "../entities/player";
import { ScoreBoardRepository } from "../repositories/scoreboard.repository";

/**
 * La clase ScoreBoardService corresponde a la capa de aplicación
 * encargada de gestionar la lógica de negocio del tablero de puntuaciones.
 * 
 * Se implementan operaciones de alto nivel sobre los jugadores, 
 * haciendo uso de un repositorio inyectado que cumple con el contrato
 * definido en la capa de dominio.
 * 
 * @author juan-ramirezm
 */
class ScoreBoardService {
    /**
     * Constructor de la clase.
     * 
     * Se inyecta una implementación del repositorio que define 
     * la gestión de datos (persistencia en memoria, base de datos, etc).
     * 
     * @param repo ScoreBoardRepository: Implementación del contrato
     * definido en la capa de dominio.
     */
    constructor(
        private readonly repo: ScoreBoardRepository
    ) {}

    /**
     * Crea una nueva instancia de Player y la almacena en el repositorio.
     * 
     * @param name string: Nombre del jugador a registrar.
     * @param score number: Puntuación inicial del jugador.
     * 
     * @returns void
     */
    addPlayer(name: string, score: number): void {
        this.repo.save(new Player(name, score));
    }

    /**
     * Actualiza la puntuación de un jugador ya existente en el repositorio.
     * 
     * 1. Busca el jugador por nombre.  
     * 2. Si no existe, lanza un error.  
     * 3. Actualiza el score usando el método propio del jugador.  
     * 4. Persiste los cambios en el repositorio.  
     * 
     * @param name string: Nombre del jugador.
     * @param newScore number: Nueva puntuación a asignar.
     * 
     * @throws Error en caso de que el jugador no exista en el repositorio.
     * @returns void
     */
    updateScore(name: string, newScore: number): void {
        const player = this.repo.findByName(name);

        if (!player) throw new Error(`jugador "${name}" no encontrado`);

        player.updateScore(newScore);
        this.repo.save(player);
    }

    /**
     * Retorna la lista de jugadores ordenada de mayor a menor
     * según la puntuación.
     * 
     * @returns Player[]: Arreglo con todos los jugadores ordenados.
     */
    getSorted(): Player[] {
        return this.repo.findAll()
                        .sort((a, b) => b.score - a.score);
    }

    /**
     * Retorna los tres primeros jugadores con mayor puntuación (podio).
     * 
     * @returns Player[]: Arreglo con los tres jugadores líderes.
     */
    getPodium(): Player[] {
        return this.getSorted().slice(0, 3);
    }

    /**
     * Retorna el jugador líder del tablero (el primero en la clasificación).
     * 
     * @returns Player | undefined: El jugador con mayor puntuación,
     * o undefined en caso de que no existan jugadores.
     */
    getLeader(): Player | undefined {
        return this.getSorted().at(0);
    }

    /**
     * Elimina un jugador del tablero de puntuaciones.
     * 
     * 1. Intenta eliminarlo mediante el repositorio.  
     * 2. Si no se encuentra, lanza un error.  
     * 
     * @param name string: Nombre del jugador a eliminar.
     * @throws Error si no se puede eliminar al jugador (por ejemplo, si no existe).
     * 
     * @returns void
     */
    removePlayer(name: string): void {
        if (!this.repo.delete(name))
            throw new Error(`No se pudo eliminar al jugador ${name}`);
    }
}

export default ScoreBoardService;
