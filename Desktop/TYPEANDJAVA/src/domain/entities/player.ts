/**
 * La clase Player es la entidad del jugador dentro de la app
 * 
 * @author juan-ramirezm
 */
class Player {
    /** 
     * Constructor básico para la creación de una instancia de Player
     * 
     * @param name string: Nombre del jugador, no se puede modificar luego de su definición
     * @param _score number: Puntaje inicial con el que se registra el jugador
     * 
     * @throws Error: Cuando el nombre está vacío
     * @throws Error: Cuando el puntaje no es un número válido
     */
    constructor(
        public readonly name: string, 
        private _score: number,
    ) {
        if (!name.trim()) 
            throw new Error("El nombre no puede estar vacío");

        if (!Number.isFinite(_score)) 
            throw new Error("El puntaje debe ser un valor numérico válido");
    }

    /**
     * @returns number: Puntaje guardado del jugador
     */
    get score() {
        return this._score;
    }

    /**
     * Actualiza el puntaje almacenado en objetos
     * 
     * @param newScore number: Nuevo puntaje
     * @throws Error: Cuando el nuevo puntaje es inválido
     */
    updateScore(newScore: number) {
        if (!Number.isFinite(newScore))
            throw new Error("Puntaje inválido");
        this._score = newScore;
    }
}

const player = new Player("juan", 0);

export default Player;
