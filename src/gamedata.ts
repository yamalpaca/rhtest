export interface Input {
  criteria: number;
  button: number;
  type: number;
  amount: number;
}

export interface Game {
  name: string;
  critname: string[];
  critweight: number[];
  inputs: Input[];
}

const inputDefault: Input = {
  criteria: 0,
  button: 1,
  type: 0,
  amount: 1,
};

function fillPair(
  a: Input,
  afill: number,
  b: Input,
  bfill: number,
  n: number,
): Input[] {
  const array: Input[] = [];
  for (let i = 0; i < n * 2; i++) {
    if (i % 2 === 0) {
      array.push(...Array(afill).fill(a));
    } else {
      array.push(...Array(bfill).fill(b));
    }
  }
  return array;
}

export const gameData: Game[] = [
  { // Karate Man
    name: "Karate Man",
    critname: ["Single Punch", "Triple Punch"],
    critweight: [65, 25, 10],
    inputs: [
      ...Array(13).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 2 },
      { ...inputDefault, criteria: 0 },
      ...Array(3).fill({ ...inputDefault, criteria: 1 }),
      { ...inputDefault, criteria: 0 },
    ],
  },
  { // Air Rally
    name: "Air Rally",
    critname: ["Normal Shot", "Long Shot"],
    critweight: [70, 20, 10],
    inputs: [
      ...Array(14).fill({ ...inputDefault, criteria: 0 }),
      ...fillPair(
        { ...inputDefault, criteria: 1 },
        1,
        { ...inputDefault, criteria: 0 },
        6,
        2,
      ),
      { ...inputDefault, criteria: 2 },
      ...Array(2).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 1 },
    ],
  },
  { // Catchy Tune
    name: "Catchy Tune",
    critname: ["Orange", "Pineapple"],
    critweight: [40, 45, 15],
    inputs: [
      ...fillPair(
        { ...inputDefault, criteria: 0, button: 3 },
        1,
        { ...inputDefault, criteria: 0, button: 1 },
        1,
        4,
      ),
      { ...inputDefault, criteria: 1, button: 3 },
      { ...inputDefault, criteria: 1, button: 1 },
      { ...inputDefault, criteria: 0, button: 3 },
      { ...inputDefault, criteria: 0, button: 1 },
      { ...inputDefault, criteria: 2, button: 3 },
      { ...inputDefault, criteria: 2, button: 1 },
      ...fillPair(
        { ...inputDefault, criteria: 1, button: 3 },
        1,
        { ...inputDefault, criteria: 1, button: 1 },
        1,
        2,
      ),
      ...fillPair(
        { ...inputDefault, criteria: 1, button: 1 },
        1,
        { ...inputDefault, criteria: 1, button: 3 },
        1,
        2,
      ),
      { ...inputDefault, criteria: 0, button: 1 },
      { ...inputDefault, criteria: 0, button: 3 },
      { ...inputDefault, criteria: 1, button: 3 },
      { ...inputDefault, criteria: 1, button: 1 },
    ],
  },
  { // Rhythm Tweezers
    name: "Rhythm Tweezers",
    critname: ["Short Hair"],
    critweight: [85, 15],
    inputs: [
      ...Array(39).fill({ ...inputDefault, criteria: 0 }),
      ...Array(4).fill({ ...inputDefault, criteria: 1 }),
      ...Array(7).fill({ ...inputDefault, criteria: 0 }),
    ],
  },
  { // Figure Fighter
    name: "Figure Fighter",
    critname: ["Single Punch", "One-Two"],
    critweight: [25, 60, 15],
    inputs: [
      ...fillPair(
        { ...inputDefault, criteria: 1 },
        4,
        { ...inputDefault, criteria: 0 },
        1,
        2,
      ),
      ...Array(2).fill({ ...inputDefault, criteria: 1 }),
      ...Array(2).fill({ ...inputDefault, criteria: 0 }),
      ...Array(6).fill({ ...inputDefault, criteria: 1 }),
      ...Array(2).fill({ ...inputDefault, criteria: 0 }),
      ...Array(2).fill({ ...inputDefault, criteria: 1 }),
      ...Array(2).fill({ ...inputDefault, criteria: 2 }),
      ...Array(6).fill({ ...inputDefault, criteria: 0 }),
      ...Array(2).fill({ ...inputDefault, criteria: 1 }),
    ],
  },
  { // The Clappy Trio
    name: "The Clappy Trio",
    critname: ["Slow Clap", "Normal Clap"],
    critweight: [50, 35, 15],
    inputs: [
      ...Array(5).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 1 },
      ...Array(2).fill({ ...inputDefault, criteria: 0 }),
      ...Array(2).fill({ ...inputDefault, criteria: 1 }),
      { ...inputDefault, criteria: 2 },
    ],
  },
  { // Shoot-'em-up
    name: "Shoot-'em-up",
    critname: ["Main", "Fast"],
    critweight: [45, 45, 10],
    inputs: [
      ...Array(17).fill({ ...inputDefault, criteria: 0 }),
      ...Array(2).fill({ ...inputDefault, criteria: 2 }),
      ...Array(14).fill({ ...inputDefault, criteria: 0 }),
      ...Array(20).fill({ ...inputDefault, criteria: 1 }),
      ...Array(2).fill({ ...inputDefault, criteria: 0 }),
    ],
  },
  { // Micro-Row
    name: "Micro-Row",
    critname: ["Single March", "Triple March"],
    critweight: [45, 45, 10],
    inputs: [
      ...Array(12).fill({ ...inputDefault, criteria: 0 }),
      ...fillPair(
        { ...inputDefault, criteria: 0 },
        6,
        { ...inputDefault, criteria: 1 },
        3,
        3,
      ),
      ...fillPair(
        { ...inputDefault, criteria: 0 },
        2,
        { ...inputDefault, criteria: 1 },
        3,
        2,
      ),
      ...Array(2).fill({ ...inputDefault, criteria: 0 }),
      ...Array(3).fill({ ...inputDefault, criteria: 2 }),
      ...Array(4).fill({ ...inputDefault, criteria: 0 }),
      ...Array(6).fill({ ...inputDefault, criteria: 1 }),
    ],
  },
  { // First Contact
    name: "First Contact",
    critname: ["Main", "Pause", "Pork Rice Bowls"],
    critweight: [60, 15, 15, 10],
    inputs: [
      ...Array(12).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 1 },
      ...Array(12).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 3 },
      ...Array(9).fill({ ...inputDefault, criteria: 0 }),
      ...Array(5).fill({ ...inputDefault, criteria: 2 }),
      ...Array(14).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 1 },
    ],
  },
  { // Bunny Hop
    name: "Bunny Hop",
    critname: ["Main", "Rest"],
    critweight: [70, 20, 10],
    inputs: [
      ...Array(37).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 1 },
      ...Array(20).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 1 },
      ...Array(12).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 1 },
      ...Array(23).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 1 },
      ...Array(8).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 2 },
      ...Array(12).fill({ ...inputDefault, criteria: 0 }),
    ],
  },
  { // Exhibition Match
    name: "Exhibition Match",
    critname: ["Main", "Silent"],
    critweight: [60, 20, 20],
    inputs: [
      ...Array(9).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 2 },
      { ...inputDefault, criteria: 1 },
      { ...inputDefault, criteria: 0 },
    ],
  },
  { // Sneaky Spirits
    name: "Sneaky Spirits",
    critname: ["Main", "Slow"],
    critweight: [50, 30, 20],
    inputs: [
      ...Array(3).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 1 },
      { ...inputDefault, criteria: 0 },
      { ...inputDefault, criteria: 2 },
      { ...inputDefault, criteria: 1 },
      { ...inputDefault, criteria: 0 },
    ],
  },
  { // Rhythm Rally
    name: "Rhythm Rally",
    critname: ["Normal Swing", "Long Swing"],
    critweight: [70, 16, 14],
    inputs: [
      { ...inputDefault, criteria: 1 },
      ...Array(8).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 1 },
      { ...inputDefault, criteria: 2 },
      ...Array(8).fill({ ...inputDefault, criteria: 0 }),
    ],
  },
  { // Flipper-Flop
    name: "Flipper-Flop",
    critname: ["Main", "Flipper-Roll"],
    critweight: [60, 30, 10],
    inputs: [
      ...fillPair(
        { ...inputDefault, criteria: 0 },
        15,
        { ...inputDefault, criteria: 1, button: 2 },
        1,
        2,
      ),
      ...Array(14).fill({ ...inputDefault, criteria: 0 }),
      ...Array(2).fill({ ...inputDefault, criteria: 1, button: 2 }),
      ...Array(14).fill({ ...inputDefault, criteria: 0 }),
      ...Array(2).fill({ ...inputDefault, criteria: 2, button: 2 }),
      ...Array(7).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 1, button: 2 },
      ...Array(6).fill({ ...inputDefault, criteria: 0 }),
      ...Array(2).fill({ ...inputDefault, criteria: 1, button: 2 }),
      ...Array(7).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 1, button: 2 },
      ...fillPair(
        { ...inputDefault, criteria: 0 },
        6,
        { ...inputDefault, criteria: 1, button: 2 },
        2,
        2,
      ),
    ],
  },
  { // Power Calligraphy
    name: "Power Calligraphy",
    critname: ["Main", "Chikara", "Kokoro", "Face"],
    critweight: [30, 25, 25, 10, 10],
    inputs: [
      ...fillPair(
        { ...inputDefault, criteria: 0 },
        3,
        { ...inputDefault, criteria: 1 },
        1,
        2,
      ),
      ...Array(2).fill({ ...inputDefault, criteria: 1 }),
      { ...inputDefault, criteria: 0 },
      ...Array(2).fill({ ...inputDefault, criteria: 4 }),
      ...Array(2).fill({ ...inputDefault, criteria: 1 }),
      { ...inputDefault, criteria: 0 },
      ...Array(2).fill({ ...inputDefault, criteria: 2 }),
      ...Array(2).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 1 },
      ...Array(2).fill({ ...inputDefault, criteria: 2 }),
      ...Array(2).fill({ ...inputDefault, criteria: 0 }),
      { ...inputDefault, criteria: 1 },
      ...Array(2).fill({ ...inputDefault, criteria: 2 }),
      { ...inputDefault, criteria: 3 },
    ],
  },
];
/*
{ ...inputDefault, criteria: 0 },

...Array(2).fill({ ...inputDefault, criteria: 0 }),

...fillPair({ ...inputDefault, criteria: 0 },1,
                  { ...inputDefault, criteria: 0 },1,
        2),

{ //
    name: "",
    critname: ["",""],
    critweight: [,,],
    inputs: [

    ],
  },
*/
