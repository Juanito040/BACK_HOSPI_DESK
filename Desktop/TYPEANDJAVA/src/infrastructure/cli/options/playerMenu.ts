export const playerQuestions = [
  {
    type: 'list',
    name: 'option',
    message: '¿Qué desea hacer?',
    choices: [
      { value: 'addPlayer', name: '1. Agregar jugador' },
      { value: 'deletePlayer', name: '2. Eliminar jugador' },
      { value: 'updateScore', name: '3. Modificar puntaje' },
      { value: 'listPlayers', name: '4. Ver todos los jugadores' },
      { value: 'back', name: `${'0.'.blue} Salir` },
    ]
  }
];