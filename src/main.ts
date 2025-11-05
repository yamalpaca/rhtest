import btnimg from "./btnimg.png";
import pntimg from "./pntimg.png";
import "./style.css";

interface Input {
  criteria: number;
  button: number;
  type: number;
  amount: number;
}

const inputDefault: Input = {
  criteria: 0,
  button: 1,
  type: 0,
  amount: 1,
};

interface Game {
  criterias: string[];
  critWeight: number[];
  inputs: Input[];
}

const gameData: Game = {
  criterias: ["Normal", "Triple Punch"],
  critWeight: [65, 25, 10],
  inputs: [
    ...Array(13).fill({ ...inputDefault }),
    { ...inputDefault, criteria: 2 },
    { ...inputDefault, criteria: 0 },
    ...Array(3).fill({ ...inputDefault, criteria: 1 }),
    { ...inputDefault, criteria: 0 },
  ],
};

const canvas = document.createElement("canvas");
document.body.append(canvas);
const ctx = canvas.getContext("2d")!;

const scoreText = document.createElement("p");
scoreText.innerHTML = `<span id="finalScore"></span>`;
scoreText.style.fontFamily = "Kurokane";
document.body.append(scoreText);
const finalScore = document.getElementById("finalScore");

let dataTable = document.createElement("table");
document.body.append(dataTable);

const tileSize: number = 30;

const rowPal: string[] = [
  "#FF9D9D",
  "#FFC668",
  "#AAFF9B",
  "#F0BAFF",
  "#FFE002",
];
const inputPal: string = "#141414ff";

const btnIcons = new Image();
btnIcons.src = btnimg;
const pntIcons = new Image();
pntIcons.src = pntimg;

let selectX: number = -1;
let selectY: number = -1;
const selectOffsetX = 134;
let mouseFocus: number = 0;

const btnPressed: boolean[] = Array(gameData.inputs.length).fill(true);
let drawState: boolean;

function updatePage() {
  drawCanvas();
  updateText();
}

function drawCanvas() {
  canvas.width = globalThis.innerWidth - 40;
  canvas.height = (tileSize * (gameData.criterias.length + 2)) + 30;

  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i: number = 0; i < gameData.criterias.length + 1; i++) {
    ctx.fillStyle = rowPal[i];
    if (i == gameData.criterias.length) ctx.fillStyle = rowPal[4];
    ctx.fillRect(
      0,
      tileSize * i,
      (gameData.inputs.length * 30) + selectOffsetX,
      tileSize,
    );

    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, (i * 30) + 29);
    ctx.lineTo(
      (gameData.inputs.length * 30) + selectOffsetX + 1,
      (i * 30) + 29,
    );
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "16px FOT-Seurat Pro";
    ctx.letterSpacing = "1px";
    ctx.textAlign = "right";

    if (i == gameData.criterias.length) {
      ctx.fillText("Skill Star", selectOffsetX - 7, (i * 30) + 21);
    } else {
      ctx.fillText(gameData.criterias[i], selectOffsetX - 7, (i * 30) + 21);
    }
  }

  ctx.fillStyle = inputPal;
  ctx.fillRect(
    0,
    tileSize * (gameData.criterias.length + 1),
    (gameData.inputs.length * 30) + selectOffsetX,
    60,
  );
  ctx.fillStyle = "white";
  ctx.fillText(
    "Buttons",
    selectOffsetX - 7,
    ((gameData.criterias.length + 1) * 30) + 21,
  );
  ctx.fillText(
    "Timing",
    selectOffsetX - 7,
    ((gameData.criterias.length + 1) * 30) + 51,
  );

  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(selectOffsetX - 1, 0);
  ctx.lineTo(selectOffsetX - 1, (gameData.criterias.length + 1) * 30);
  ctx.stroke();
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(selectOffsetX - 1, (gameData.criterias.length + 1) * 30);
  ctx.lineTo(selectOffsetX - 1, ((gameData.criterias.length + 1) * 30) + 60);
  ctx.stroke();

  if (selectX > -1 && selectX < gameData.inputs.length) {
    ctx.fillStyle = "#ffffff30";
    ctx.fillRect(
      (selectX * tileSize) + selectOffsetX,
      tileSize * (gameData.criterias.length + 1),
      tileSize,
      60,
    );
  }

  for (let i: number = 0; i < gameData.inputs.length; i++) {
    ctx.filter = "brightness(100%)";
    let pntindex = gameData.inputs[i].criteria;
    if (pntindex == gameData.criterias.length) pntindex = 4;
    let pnttype = 0;
    if (!btnPressed[i]) pnttype = 3;

    drawIcon(
      (i * tileSize) + selectOffsetX,
      gameData.inputs[i].criteria * tileSize,
      pnttype,
      pntindex,
      pntIcons,
    );

    if (selectX == i && selectY == gameData.criterias.length + 1) {
      ctx.filter = "brightness(150%)";
      if (mouseFocus != 0) ctx.filter = "brightness(75%)";
    } else {
      ctx.filter = "brightness(100%)";
    }

    if (!btnPressed[i]) {
      ctx.filter += "grayscale(100%)";
    }

    drawIcon(
      (i * tileSize) + selectOffsetX,
      (gameData.criterias.length + 1) * tileSize,
      gameData.inputs[i].button,
      0,
      btnIcons,
    );

    /*
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.letterSpacing = "0px";
    ctx.filter = "none";
    ctx.fillText(
      "+0",
      (i * tileSize) + selectOffsetX + 15,
      ((gameData.criterias.length + 2) * tileSize) + 21,
    );
    */
  }
  ctx.filter = "none";
}

function updateText() {
  if (!finalScore) return;
  const scores: number[] = Array(gameData.criterias.length + 1).fill(0);
  const totalInputs: number[] = Array(gameData.criterias.length + 1).fill(0);

  for (let i: number = 0; i < gameData.inputs.length; i++) {
    const crit = gameData.inputs[i].criteria;
    totalInputs[crit]++;
    if (btnPressed[i]) scores[crit]++;
  }

  let scoreSum: number = 0;
  for (let i: number = 0; i < gameData.criterias.length + 1; i++) {
    scoreSum += gameData.critWeight[i] * (scores[i] / totalInputs[i]);
  }

  finalScore.textContent = Math.floor(badRounding(scoreSum)).toString();

  const temp = document.createElement("table");
  temp.style.borderCollapse = "collapse";
  temp.style.font = "16px FOT-Seurat Pro";

  for (let i = 0; i < gameData.criterias.length + 2; i++) {
    const row = temp.insertRow(-1);
    for (let j = 0; j < 5; j++) {
      const cell = row.insertCell(-1);
      cell.style.border = "1px solid black";
      cell.style.textAlign = "center";
      cell.style.width = "100px";
      cell.style.height = "0px";
      cell.style.padding = "0px";

      let text = "";

      switch (j) {
        case 0: {
          cell.style.textAlign = "right";
          cell.style.width = "125px";
          cell.style.padding = "0px 8px 0px 8px";
          if (i == 0) text = "criteria";
          else if (i == gameData.criterias.length + 1) text = "Skill Star";
          else {
            text = gameData.criterias[i - 1];
          }

          break;
        }
        case 1: {
          if (i == 0) text = "weight";
          else {
            text = gameData.critWeight[i - 1].toString() + "%";
          }
          break;
        }
        case 2: {
          if (i == 0) text = "wpi";
          else {
            text = badRounding(
              1 / totalInputs[i - 1] * gameData.critWeight[i - 1],
            ).toString();
          }
          break;
        }
        case 3: {
          if (i == 0) text = "score";
          else {
            text = scores[i - 1].toString() + " / " +
              totalInputs[i - 1].toString();
          }
          break;
        }
        case 4: {
          if (i == 0) text = "w score";
          else {
            text = badRounding(
              scores[i - 1] / totalInputs[i - 1] * gameData.critWeight[i - 1],
            ).toString();
          }
          break;
        }
      }

      cell.appendChild(document.createTextNode(text));
    }
  }

  dataTable.replaceWith(temp);
  dataTable = temp;
}

function badRounding(n: number) {
  return Math.floor(n * 100) / 100;
}

btnIcons.onload = () => updatePage();
pntIcons.onload = () => updatePage();

globalThis.addEventListener("resize", updatePage);

canvas.addEventListener("mousemove", (e) => {
  selectX = Math.floor((e.offsetX - selectOffsetX) / 30);
  selectY = Math.floor(e.offsetY / 30);
  if (mouseFocus == 2 && selectY == gameData.criterias.length + 1) {
    btnPressed[selectX] = drawState;
  }
  updatePage();
});

canvas.addEventListener("mousedown", () => {
  mouseFocus = 1;
  if (selectY == gameData.criterias.length + 1) {
    mouseFocus = 2;
    drawState = !btnPressed[selectX];
    btnPressed[selectX] = !btnPressed[selectX];
  }
  updatePage();
});

canvas.addEventListener("mouseup", () => {
  mouseFocus = 0;
  updatePage();
});

canvas.addEventListener("mouseleave", () => {
  selectX = -1;
  selectY = -1;
  updatePage();
});

function drawIcon(
  x: number,
  y: number,
  ix: number,
  iy: number,
  img: HTMLImageElement,
): void {
  ctx.drawImage(img, ix * 30, iy * 30, 30, 30, x, y, 30, 30);
}
