export const principalQuestions = [
  {
    type: 'list',
    name: 'option',
    message: '¿Qué desea hacer?',
    choices: [
      { value: 'managePlayers', name: '1. Gestión de jugadores' },
      { value: 'showScores', name: '2. Ver tabla de puntuaciones' },
      { value: 'showLeader', name: '3. Ver líder' },
      { value: 'showPodium', name: '4. Ver podium' },
      { value: '0',name: `${'0.'.blue} Salir` },
    ]
  }
];
