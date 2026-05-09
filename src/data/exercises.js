export const exercises = [
  // PECHO
  { id: 1,  name: 'Press de Banca',      muscle: 'pecho',   category: 'fuerza',        description: 'Empuje horizontal con barra, activa pectoral mayor y tríceps.',       secPerRep: 4,  calPerRep: 0.8, icon: '🏋️' },
  { id: 15, name: 'Aperturas',           muscle: 'pecho',   category: 'aislamiento',   description: 'Apertura con mancuernas en banco plano para pectoral.',                secPerRep: 3,  calPerRep: 0.5, icon: '🦋' },
  { id: 16, name: 'Flexiones',           muscle: 'pecho',   category: 'peso corporal', description: 'Empuje con peso corporal para pectoral y tríceps.',                   secPerRep: 3,  calPerRep: 0.5, icon: '⬇️' },
  { id: 17, name: 'Press Inclinado',     muscle: 'pecho',   category: 'fuerza',        description: 'Empuje en banco inclinado para porción superior del pectoral.',       secPerRep: 4,  calPerRep: 0.9, icon: '📐' },
  // ESPALDA
  { id: 3,  name: 'Peso Muerto',         muscle: 'espalda', category: 'fuerza',        description: 'Tirón desde el suelo, activa cadena posterior completa.',            secPerRep: 5,  calPerRep: 1.2, icon: '⬆️' },
  { id: 4,  name: 'Dominadas',           muscle: 'espalda', category: 'peso corporal', description: 'Tirón vertical, trabaja dorsal, bíceps y core.',                     secPerRep: 4,  calPerRep: 0.7, icon: '🔝' },
  { id: 11, name: 'Remo con Barra',      muscle: 'espalda', category: 'fuerza',        description: 'Tirón horizontal para dorsal ancho y romboides.',                    secPerRep: 4,  calPerRep: 0.9, icon: '🚣' },
  { id: 18, name: 'Jalón Polea',         muscle: 'espalda', category: 'máquina',       description: 'Tirón vertical en polea para dorsal ancho.',                         secPerRep: 4,  calPerRep: 0.7, icon: '⬇️' },
  // BRAZOS
  { id: 6,  name: 'Curl de Bíceps',     muscle: 'brazos',  category: 'aislamiento',   description: 'Flexión de codo para bíceps braquial.',                              secPerRep: 3,  calPerRep: 0.4, icon: '💪' },
  { id: 13, name: 'Curl Martillo',       muscle: 'brazos',  category: 'aislamiento',   description: 'Curl neutro para bíceps y braquiorradial.',                          secPerRep: 3,  calPerRep: 0.4, icon: '🔨' },
  { id: 7,  name: 'Tríceps Polea',      muscle: 'brazos',  category: 'aislamiento',   description: 'Extensión de codo en polea para tríceps en sus tres cabezas.',       secPerRep: 3,  calPerRep: 0.4, icon: '🔱' },
  { id: 14, name: 'Fondos',             muscle: 'brazos',  category: 'peso corporal', description: 'Fondos en paralelas para tríceps y pectoral inferior.',              secPerRep: 4,  calPerRep: 0.6, icon: '⬇️' },
  // HOMBROS
  { id: 5,  name: 'Press Militar',      muscle: 'hombros', category: 'fuerza',        description: 'Empuje vertical sobre cabeza para deltoides y tríceps.',             secPerRep: 4,  calPerRep: 0.7, icon: '🏋️' },
  { id: 8,  name: 'Elevaciones Lat.',   muscle: 'hombros', category: 'aislamiento',   description: 'Abducción de hombro para deltoides lateral.',                        secPerRep: 3,  calPerRep: 0.3, icon: '↔️' },
  { id: 19, name: 'Face Pull',          muscle: 'hombros', category: 'aislamiento',   description: 'Tirón facial en polea para deltoides posterior y manguito rotador.', secPerRep: 3,  calPerRep: 0.3, icon: '🎯' },
  // PIERNA
  { id: 2,  name: 'Sentadilla',         muscle: 'pierna',  category: 'fuerza',        description: 'Movimiento compuesto para cuádriceps, glúteos e isquiotibiales.',    secPerRep: 4,  calPerRep: 1.0, icon: '🦵' },
  { id: 20, name: 'Prensa de Pierna',   muscle: 'pierna',  category: 'máquina',       description: 'Empuje en prensa para cuádriceps y glúteos.',                        secPerRep: 4,  calPerRep: 0.9, icon: '🦵' },
  { id: 12, name: 'Zancadas',           muscle: 'pierna',  category: 'fuerza',        description: 'Paso unilateral para cuádriceps, glúteos y equilibrio.',             secPerRep: 4,  calPerRep: 0.8, icon: '🦶' },
  { id: 21, name: 'Leg Curl',           muscle: 'pierna',  category: 'máquina',       description: 'Flexión de rodilla en máquina para isquiotibiales.',                 secPerRep: 3,  calPerRep: 0.6, icon: '🦵' },
  { id: 22, name: 'Pantorrillas',       muscle: 'pierna',  category: 'aislamiento',   description: 'Elevación de talones para gemelos y sóleo.',                         secPerRep: 3,  calPerRep: 0.3, icon: '🦶' },
  // CORE
  { id: 9,  name: 'Plancha',            muscle: 'core',    category: 'peso corporal', description: 'Isometría para core, lumbar y estabilidad total.',                   secPerRep: 30, calPerRep: 0.5, icon: '🧘' },
  { id: 10, name: 'Abdominales',        muscle: 'core',    category: 'peso corporal', description: 'Flexión de tronco para recto abdominal.',                            secPerRep: 3,  calPerRep: 0.3, icon: '🔲' },
  { id: 23, name: 'Rueda Abdominal',    muscle: 'core',    category: 'peso corporal', description: 'Extensión abdominal con rueda para core completo.',                  secPerRep: 4,  calPerRep: 0.5, icon: '⭕' },
]

export const muscleGroups = ['pecho', 'espalda', 'brazos', 'hombros', 'pierna', 'core']
