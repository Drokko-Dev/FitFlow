// Reference values — secPerRep, calPerRep and restSec (exercise physiology standards, ~75 kg person)
//
// secPerRep (concentric + eccentric phases):
//   Large compound   (squat, deadlift, bench press) : 4–5 s
//   Medium compound  (row, pull-up, military press)  : 4 s
//   Isolation large  (curl, extension)               : 3 s
//   Isolation small  (lateral raise, shrug)          : 3 s
//   Isometric        (plank): secPerRep = 30 → each "rep" = 30 s hold
//
// calPerRep (MET-based for ~75 kg):
//   Large compound   : 1.0–1.2
//   Medium compound  : 0.7–0.9
//   Large isolation  : 0.5–0.7
//   Small isolation  : 0.3–0.5
//
// restSec (inter-set rest by category):
//   fuerza           : 120 s  (heavy compound, CNS recovery)
//   aislamiento      : 60 s   (single-joint, metabolic)
//   peso corporal    : 45 s   (bodyweight, higher density)
//   máquina          : 60 s   (guided, similar to isolation)

export const exercises = [
  // PECHO
  { id: 1,  name: 'Press de Banca',                muscle: 'pecho',   category: 'fuerza',        restSec: 120, description: 'Empuje horizontal con barra, activa pectoral mayor y tríceps.',                      secPerRep: 4,  calPerRep: 0.8, icon: '🏋️' },
  { id: 15, name: 'Aperturas',                     muscle: 'pecho',   category: 'aislamiento',   restSec: 60,  description: 'Apertura con mancuernas en banco plano para pectoral.',                               secPerRep: 3,  calPerRep: 0.5, icon: '🦋' },
  { id: 16, name: 'Flexiones',                     muscle: 'pecho',   category: 'peso corporal', restSec: 45,  description: 'Empuje con peso corporal para pectoral y tríceps.',                                   secPerRep: 3,  calPerRep: 0.5, icon: '⬇️' },
  { id: 17, name: 'Press Inclinado',               muscle: 'pecho',   category: 'fuerza',        restSec: 120, description: 'Empuje en banco inclinado para porción superior del pectoral.',                      secPerRep: 4,  calPerRep: 0.9, icon: '📐' },
  { id: 24, name: 'Press con Mancuernas',          muscle: 'pecho',   category: 'fuerza',        restSec: 120, description: 'Variación con mancuernas que amplía el rango de movimiento del pectoral.',           secPerRep: 4,  calPerRep: 0.8, icon: '🏋️', variation: 'Press de Banca' },
  { id: 25, name: 'Press Declinado',               muscle: 'pecho',   category: 'fuerza',        restSec: 120, description: 'Empuje en banco declinado para pectoral inferior y tríceps.',                        secPerRep: 4,  calPerRep: 0.8, icon: '📉', variation: 'Press de Banca' },
  { id: 26, name: 'Fondos en Paralelas',           muscle: 'pecho',   category: 'peso corporal', restSec: 45,  description: 'Fondos con torso inclinado al frente para énfasis en pectoral inferior.',            secPerRep: 4,  calPerRep: 0.7, icon: '⬇️', variation: 'Fondos' },
  { id: 27, name: 'Crossover en Polea',            muscle: 'pecho',   category: 'aislamiento',   restSec: 60,  description: 'Cruce de cables para pectoral, máxima contracción en la línea media.',               secPerRep: 3,  calPerRep: 0.5, icon: '✂️' },
  { id: 28, name: 'Push-up Diamante',              muscle: 'pecho',   category: 'peso corporal', restSec: 45,  description: 'Flexiones con manos en diamante para pectoral interno y tríceps.',                   secPerRep: 3,  calPerRep: 0.5, icon: '💎', variation: 'Flexiones' },

  // ESPALDA
  { id: 3,  name: 'Peso Muerto',                   muscle: 'espalda', category: 'fuerza',        restSec: 120, description: 'Tirón desde el suelo, activa cadena posterior completa.',                            secPerRep: 5,  calPerRep: 1.2, icon: '⬆️' },
  { id: 4,  name: 'Dominadas',                     muscle: 'espalda', category: 'peso corporal', restSec: 45,  description: 'Tirón vertical, trabaja dorsal, bíceps y core.',                                     secPerRep: 4,  calPerRep: 0.7, icon: '🔝' },
  { id: 11, name: 'Remo con Barra',                muscle: 'espalda', category: 'fuerza',        restSec: 120, description: 'Tirón horizontal para dorsal ancho y romboides.',                                    secPerRep: 4,  calPerRep: 0.9, icon: '🚣' },
  { id: 18, name: 'Jalón Polea',                   muscle: 'espalda', category: 'máquina',       restSec: 60,  description: 'Tirón vertical en polea para dorsal ancho.',                                         secPerRep: 4,  calPerRep: 0.7, icon: '⬇️' },
  { id: 29, name: 'Remo en Polea Baja',            muscle: 'espalda', category: 'máquina',       restSec: 60,  description: 'Tirón horizontal en polea baja para dorsal y romboides.',                            secPerRep: 4,  calPerRep: 0.8, icon: '🚣', variation: 'Remo con Barra' },
  { id: 30, name: 'Remo con Mancuerna',            muscle: 'espalda', category: 'fuerza',        restSec: 120, description: 'Remo unilateral con mancuerna para dorsal y retracción escapular.',                  secPerRep: 4,  calPerRep: 0.8, icon: '🚣', variation: 'Remo con Barra' },
  { id: 31, name: 'Pull-over con Mancuerna',       muscle: 'espalda', category: 'aislamiento',   restSec: 60,  description: 'Extensión de hombro en banco para dorsal ancho y pectoral.',                        secPerRep: 3,  calPerRep: 0.5, icon: '🔄' },
  { id: 32, name: 'Hiperextensiones',              muscle: 'espalda', category: 'peso corporal', restSec: 45,  description: 'Extensión de cadera en banco romano para lumbar y glúteos.',                         secPerRep: 3,  calPerRep: 0.4, icon: '🔙' },
  { id: 33, name: 'Remo en Máquina',               muscle: 'espalda', category: 'máquina',       restSec: 60,  description: 'Tirón horizontal en máquina para dorsal y bíceps.',                                  secPerRep: 4,  calPerRep: 0.7, icon: '🚣', variation: 'Remo con Barra' },

  // BRAZOS
  { id: 6,  name: 'Curl de Bíceps',               muscle: 'brazos',  category: 'aislamiento',   restSec: 60,  description: 'Flexión de codo para bíceps braquial.',                                              secPerRep: 3,  calPerRep: 0.4, icon: '💪' },
  { id: 13, name: 'Curl Martillo',                 muscle: 'brazos',  category: 'aislamiento',   restSec: 60,  description: 'Curl neutro para bíceps y braquiorradial.',                                          secPerRep: 3,  calPerRep: 0.4, icon: '🔨' },
  { id: 7,  name: 'Tríceps Polea',                muscle: 'brazos',  category: 'aislamiento',   restSec: 60,  description: 'Extensión de codo en polea para tríceps en sus tres cabezas.',                       secPerRep: 3,  calPerRep: 0.4, icon: '🔱' },
  { id: 14, name: 'Fondos',                        muscle: 'brazos',  category: 'peso corporal', restSec: 45,  description: 'Fondos en paralelas para tríceps y pectoral inferior.',                              secPerRep: 4,  calPerRep: 0.6, icon: '⬇️' },
  { id: 34, name: 'Curl de Bíceps con Barra',      muscle: 'brazos',  category: 'aislamiento',   restSec: 60,  description: 'Flexión de codo con barra para mayor carga en bíceps braquial.',                    secPerRep: 3,  calPerRep: 0.4, icon: '💪', variation: 'Curl de Bíceps' },
  { id: 35, name: 'Curl en Polea',                 muscle: 'brazos',  category: 'aislamiento',   restSec: 60,  description: 'Curl en polea baja con tensión constante durante todo el rango.',                    secPerRep: 3,  calPerRep: 0.4, icon: '💪', variation: 'Curl de Bíceps' },
  { id: 36, name: 'Curl Concentrado',              muscle: 'brazos',  category: 'aislamiento',   restSec: 60,  description: 'Curl unilateral con apoyo en rodilla para máximo pico de bíceps.',                   secPerRep: 3,  calPerRep: 0.3, icon: '💪', variation: 'Curl de Bíceps' },
  { id: 37, name: 'Curl 21s',                      muscle: 'brazos',  category: 'aislamiento',   restSec: 60,  description: 'Protocolo de 21 repeticiones divididas en tres rangos de movimiento para bíceps.',   secPerRep: 3,  calPerRep: 0.5, icon: '🔢', variation: 'Curl de Bíceps' },
  { id: 38, name: 'Extensión de Tríceps Tumbado',  muscle: 'brazos',  category: 'aislamiento',   restSec: 60,  description: 'Skull crusher: extensión de codo tumbado para cabeza larga del tríceps.',            secPerRep: 3,  calPerRep: 0.4, icon: '🔱', variation: 'Tríceps Polea' },
  { id: 39, name: 'Patada de Tríceps',             muscle: 'brazos',  category: 'aislamiento',   restSec: 60,  description: 'Extensión de codo inclinado para cabeza lateral del tríceps.',                       secPerRep: 3,  calPerRep: 0.3, icon: '🦵', variation: 'Tríceps Polea' },
  { id: 40, name: 'Extensión sobre Cabeza',        muscle: 'brazos',  category: 'aislamiento',   restSec: 60,  description: 'Extensión con mancuerna sobre cabeza para cabeza larga del tríceps.',                secPerRep: 3,  calPerRep: 0.4, icon: '☝️', variation: 'Tríceps Polea' },
  { id: 41, name: 'Dips entre Bancos',             muscle: 'brazos',  category: 'peso corporal', restSec: 45,  description: 'Fondos entre dos bancos con énfasis en tríceps.',                                    secPerRep: 3,  calPerRep: 0.5, icon: '⬇️', variation: 'Fondos' },

  // HOMBROS
  { id: 5,  name: 'Press Militar',                 muscle: 'hombros', category: 'fuerza',        restSec: 120, description: 'Empuje vertical sobre cabeza para deltoides y tríceps.',                             secPerRep: 4,  calPerRep: 0.7, icon: '🏋️' },
  { id: 8,  name: 'Elevaciones Lat.',              muscle: 'hombros', category: 'aislamiento',   restSec: 60,  description: 'Abducción de hombro para deltoides lateral.',                                        secPerRep: 3,  calPerRep: 0.3, icon: '↔️' },
  { id: 19, name: 'Face Pull',                     muscle: 'hombros', category: 'aislamiento',   restSec: 60,  description: 'Tirón facial en polea para deltoides posterior y manguito rotador.',                 secPerRep: 3,  calPerRep: 0.3, icon: '🎯' },
  { id: 42, name: 'Press Arnold',                  muscle: 'hombros', category: 'fuerza',        restSec: 120, description: 'Press rotacional con mancuernas para los tres haces del deltoides.',                 secPerRep: 4,  calPerRep: 0.7, icon: '🏋️', variation: 'Press Militar' },
  { id: 43, name: 'Elevaciones Frontales',         muscle: 'hombros', category: 'aislamiento',   restSec: 60,  description: 'Elevación frontal de mancuerna para deltoides anterior.',                            secPerRep: 3,  calPerRep: 0.3, icon: '⬆️' },
  { id: 44, name: 'Pájaros',                       muscle: 'hombros', category: 'aislamiento',   restSec: 60,  description: 'Apertura inclinada con mancuernas para deltoides posterior y romboides.',            secPerRep: 3,  calPerRep: 0.3, icon: '🦅' },
  { id: 45, name: 'Encogimientos de Hombros',      muscle: 'hombros', category: 'aislamiento',   restSec: 60,  description: 'Elevación de hombros con carga para trapecio superior.',                             secPerRep: 3,  calPerRep: 0.3, icon: '🤷' },
  { id: 46, name: 'Press con Mancuernas',          muscle: 'hombros', category: 'fuerza',        restSec: 120, description: 'Press de hombros con mancuernas para deltoides y tríceps.',                          secPerRep: 4,  calPerRep: 0.7, icon: '🏋️', variation: 'Press Militar' },

  // PIERNA
  { id: 2,  name: 'Sentadilla',                    muscle: 'pierna',  category: 'fuerza',        restSec: 120, description: 'Movimiento compuesto para cuádriceps, glúteos e isquiotibiales.',                    secPerRep: 4,  calPerRep: 1.0, icon: '🦵' },
  { id: 20, name: 'Prensa de Pierna',              muscle: 'pierna',  category: 'máquina',       restSec: 60,  description: 'Empuje en prensa para cuádriceps y glúteos.',                                        secPerRep: 4,  calPerRep: 0.9, icon: '🦵' },
  { id: 12, name: 'Zancadas',                      muscle: 'pierna',  category: 'fuerza',        restSec: 120, description: 'Paso unilateral para cuádriceps, glúteos y equilibrio.',                             secPerRep: 4,  calPerRep: 0.8, icon: '🦶' },
  { id: 21, name: 'Leg Curl',                      muscle: 'pierna',  category: 'máquina',       restSec: 60,  description: 'Flexión de rodilla en máquina para isquiotibiales.',                                 secPerRep: 3,  calPerRep: 0.6, icon: '🦵' },
  { id: 22, name: 'Pantorrillas',                  muscle: 'pierna',  category: 'aislamiento',   restSec: 60,  description: 'Elevación de talones para gemelos y sóleo.',                                         secPerRep: 3,  calPerRep: 0.3, icon: '🦶' },
  { id: 47, name: 'Sentadilla Sumo',               muscle: 'pierna',  category: 'fuerza',        restSec: 120, description: 'Sentadilla con apertura amplia para aductores, glúteos y cuádriceps.',               secPerRep: 4,  calPerRep: 1.0, icon: '🦵', variation: 'Sentadilla' },
  { id: 48, name: 'Sentadilla Búlgara',            muscle: 'pierna',  category: 'fuerza',        restSec: 120, description: 'Sentadilla unilateral con pie trasero elevado para cuádriceps y glúteos.',           secPerRep: 4,  calPerRep: 0.9, icon: '🦵', variation: 'Sentadilla' },
  { id: 49, name: 'Peso Muerto Rumano',            muscle: 'pierna',  category: 'fuerza',        restSec: 120, description: 'Descenso controlado con rodillas semirígidas para isquiotibiales y glúteos.',        secPerRep: 4,  calPerRep: 1.0, icon: '⬆️', variation: 'Peso Muerto' },
  { id: 50, name: 'Hip Thrust',                    muscle: 'pierna',  category: 'fuerza',        restSec: 120, description: 'Empuje de cadera con barra apoyado en banco para glúteo mayor.',                     secPerRep: 3,  calPerRep: 0.8, icon: '🍑' },
  { id: 51, name: 'Extensión de Cuádriceps',       muscle: 'pierna',  category: 'máquina',       restSec: 60,  description: 'Extensión de rodilla en máquina para cuádriceps.',                                   secPerRep: 3,  calPerRep: 0.5, icon: '🦵' },
  { id: 52, name: 'Abductores en Máquina',         muscle: 'pierna',  category: 'máquina',       restSec: 60,  description: 'Apertura de piernas en máquina para abductores y tensor de la fascia lata.',         secPerRep: 3,  calPerRep: 0.4, icon: '↔️' },
  { id: 53, name: 'Adductores en Máquina',         muscle: 'pierna',  category: 'máquina',       restSec: 60,  description: 'Cierre de piernas en máquina para aductores.',                                       secPerRep: 3,  calPerRep: 0.4, icon: '↔️' },
  { id: 54, name: 'Step-up con Mancuernas',        muscle: 'pierna',  category: 'fuerza',        restSec: 120, description: 'Subida al banco con mancuernas para cuádriceps y glúteos.',                          secPerRep: 4,  calPerRep: 0.7, icon: '🪜' },

  // CORE
  { id: 9,  name: 'Plancha',                       muscle: 'core',    category: 'peso corporal', restSec: 45,  description: 'Isometría para core, lumbar y estabilidad total.',                                   secPerRep: 30, calPerRep: 0.5, icon: '🧘' },
  { id: 10, name: 'Abdominales',                   muscle: 'core',    category: 'peso corporal', restSec: 45,  description: 'Flexión de tronco para recto abdominal.',                                            secPerRep: 3,  calPerRep: 0.3, icon: '🔲' },
  { id: 23, name: 'Rueda Abdominal',               muscle: 'core',    category: 'peso corporal', restSec: 45,  description: 'Extensión abdominal con rueda para core completo.',                                  secPerRep: 4,  calPerRep: 0.5, icon: '⭕' },
  { id: 55, name: 'Crunch',                        muscle: 'core',    category: 'peso corporal', restSec: 45,  description: 'Flexión parcial de tronco para recto abdominal superior.',                           secPerRep: 3,  calPerRep: 0.3, icon: '🔲', variation: 'Abdominales' },
  { id: 56, name: 'Crunch Inverso',                muscle: 'core',    category: 'peso corporal', restSec: 45,  description: 'Elevación de pelvis en decúbito para recto abdominal inferior.',                     secPerRep: 3,  calPerRep: 0.3, icon: '🔄', variation: 'Abdominales' },
  { id: 57, name: 'Russian Twist',                 muscle: 'core',    category: 'peso corporal', restSec: 45,  description: 'Rotación de tronco sentado para oblicuos externos e internos.',                      secPerRep: 3,  calPerRep: 0.3, icon: '🌀' },
  { id: 58, name: 'Elevación de Piernas',          muscle: 'core',    category: 'peso corporal', restSec: 45,  description: 'Elevación de piernas tumbado para recto abdominal inferior y flexores de cadera.',   secPerRep: 3,  calPerRep: 0.3, icon: '🦵' },
  { id: 59, name: 'Plancha Lateral',               muscle: 'core',    category: 'peso corporal', restSec: 45,  description: 'Isometría lateral para oblicuos y cuadrado lumbar.',                                 secPerRep: 30, calPerRep: 0.4, icon: '🧘', variation: 'Plancha' },
  { id: 60, name: 'Dead Bug',                      muscle: 'core',    category: 'peso corporal', restSec: 45,  description: 'Extensión contralateral de brazo-pierna para estabilidad de core profundo.',         secPerRep: 4,  calPerRep: 0.3, icon: '🐛' },
  { id: 61, name: 'Dragon Flag',                   muscle: 'core',    category: 'peso corporal', restSec: 45,  description: 'Bajada controlada del cuerpo en banco para core completo. Ejercicio avanzado.',      secPerRep: 4,  calPerRep: 0.5, icon: '🐉' },
  { id: 62, name: 'Cable Crunch',                  muscle: 'core',    category: 'máquina',       restSec: 60,  description: 'Flexión de tronco en polea alta con sobrecarga para recto abdominal.',               secPerRep: 3,  calPerRep: 0.4, icon: '⬇️' },
]

export const muscleGroups = ['pecho', 'espalda', 'brazos', 'hombros', 'pierna', 'core']
