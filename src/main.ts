import btnimg from "./btnimg.png";
import meterimg from "./meterimg.png";
import pntimg from "./pntimg.png";
import "./style.css";

interface Criteria {
  id: number;
  name: string;
  weight: number;
  hit: number;
  total: number;
  score: number;
}

const critPal: string[] = [
  "#ABC8FF",
  "#AAFF9B",
  "#FF9D9D",
  "#F0BAFF",
  "#FFE002",
];

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
  critid: number[];
  critname: string[];
  critweight: number[];
  inputs: Input[];
}

const gameData: Game = {
  critid: [0, 1, 4],
  critname: ["Main", "Triple Punch"],
  critweight: [65, 25, 10],
  inputs: [
    ...Array(13).fill({ ...inputDefault }),
    { ...inputDefault, criteria: 2 },
    { ...inputDefault, criteria: 0 },
    ...Array(3).fill({ ...inputDefault, criteria: 1 }),
    { ...inputDefault, criteria: 0 },
  ],
};

const chartCanvas = document.createElement("canvas");
document.body.append(chartCanvas);

const pressText = document.createElement("p");
pressText.style.fontFamily = "Arial";
document.body.append(pressText);
let pressCounter: number;

const diffText = document.createElement("p");
diffText.style.fontFamily = "Arial";
document.body.append(diffText);

const meterCanvas = document.createElement("canvas");
document.body.append(meterCanvas);

const scoreText = document.createElement("p");
scoreText.textContent = "";
scoreText.style.fontFamily = "Kurokane";
document.body.append(scoreText);
let finalScore: number;
let prevScore: number;

let dataTable = document.createElement("table");
document.body.append(dataTable);

const tileSize: number = 30;

const btnIcons = new Image();
btnIcons.src = btnimg;
const pntIcons = new Image();
pntIcons.src = pntimg;
const meter = new Image();
meter.src = meterimg;

let selectX: number = -1;
let selectY: number = -1;
const selectOffsetX = 90;
let mouseFocus: number = 0;
const currCrit: Criteria[] = [];

const btnPressed: boolean[] = Array(gameData.inputs.length).fill(true);
let drawState: boolean;

function updatePage() {
  updateData();
  drawChartCanvas();
  updateText();
  drawMeterCanvas();
}

function updateData() {
  currCrit.splice(0, currCrit.length);

  prevScore = finalScore;

  finalScore = 0;

  pressCounter = 0;

  for (let i: number = 0; i < gameData.critid.length; i++) {
    currCrit.push({
      id: gameData.critid[i],
      name: gameData.critid[i] == 4 ? "Skill Star" : gameData.critname[i],
      weight: gameData.critweight[i],
      hit: 0,
      total: 0,
      score: 0,
    });
  }

  for (let i: number = 0; i < gameData.inputs.length; i++) {
    currCrit[gameData.inputs[i].criteria].total++;
    if (btnPressed[i]) {
      pressCounter++;
      currCrit[gameData.inputs[i].criteria].hit++;
    }
  }

  currCrit.forEach((c: Criteria) => {
    c.score = (c.hit / c.total) * c.weight;
    finalScore += c.score;
  });
}

function drawChartCanvas() {
  //chartCanvas.width = globalThis.innerWidth - 40;
  chartCanvas.width = (gameData.inputs.length * tileSize) + selectOffsetX;
  chartCanvas.height = tileSize * (currCrit.length + 3);

  const ctx = chartCanvas.getContext("2d")!;
  if (!ctx) return;

  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
  ctx.fillStyle = "#141414ff";
  ctx.fillRect(0, 0, chartCanvas.width, chartCanvas.height);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(selectOffsetX - 1, 0);
  ctx.lineTo(selectOffsetX - 1, (currCrit.length + 3) * tileSize);
  ctx.stroke();

  for (let i: number = 0; i < currCrit.length; i++) {
    ctx.fillStyle = critPal[currCrit[i].id];
    ctx.fillRect(
      0,
      tileSize * (i + 1),
      (gameData.inputs.length * tileSize) + selectOffsetX,
      tileSize,
    );

    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, (i + 2) * tileSize - 1);
    ctx.lineTo(
      (gameData.inputs.length * tileSize) + selectOffsetX,
      (i + 2) * tileSize - 1,
    );
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.letterSpacing = "1px";
    ctx.textAlign = "right";

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.fillText(
      currCrit[i].hit.toString() + "/" + currCrit[i].total.toString(),
      selectOffsetX - 32,
      (i + 2) * tileSize - 10,
    );

    drawIcon(
      selectOffsetX - tileSize - 1,
      (i + 1) * tileSize,
      0,
      currCrit[i].id,
      pntIcons,
      chartCanvas,
    );
  }

  ctx.font = "16px FOT-Seurat Pro";
  ctx.letterSpacing = "1px";
  ctx.fillStyle = "white";
  ctx.fillText(
    "Inputs",
    selectOffsetX - 7,
    21,
  );
  ctx.fillText(
    "Buttons",
    selectOffsetX - 7,
    (currCrit.length + 2) * tileSize - 9,
  );
  ctx.fillText(
    "Timing",
    selectOffsetX - 7,
    (currCrit.length + 3) * tileSize - 9,
  );

  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(selectOffsetX - 1, tileSize);
  ctx.lineTo(selectOffsetX - 1, (currCrit.length + 1) * tileSize);
  ctx.stroke();

  if (selectX > -1 && selectX < gameData.inputs.length) {
    ctx.fillStyle = "#ffffff30";
    ctx.fillRect(
      (selectX * tileSize) + selectOffsetX,
      tileSize * (currCrit.length + 1),
      tileSize,
      tileSize * 2,
    );
  }

  for (let i: number = 0; i < gameData.inputs.length; i++) {
    ctx.filter = "brightness(100%)";
    const iindex = gameData.inputs[i].criteria == currCrit.length - 1
      ? 4
      : gameData.inputs[i].criteria;
    const itype = btnPressed[i] ? 1 : 4;

    drawIcon(
      (i * tileSize) + selectOffsetX,
      (gameData.inputs[i].criteria + 1) * tileSize,
      itype,
      iindex,
      pntIcons,
      chartCanvas,
    );

    if (selectX == i && selectY == currCrit.length + 1) {
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
      (currCrit.length + 1) * tileSize,
      gameData.inputs[i].button,
      0,
      btnIcons,
      chartCanvas,
    );
  }
  ctx.filter = "none";
}

function drawMeterCanvas() {
  const ctx = meterCanvas.getContext("2d")!;
  if (!ctx || !scoreText) return;

  ctx.fillStyle = "#2A2A2A";
  ctx.fillRect(9, 9, 214, 30);

  if (+scoreText.textContent > 60) {
    if (+scoreText.textContent > 80) {
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(9, 9, 214 * (+scoreText.textContent / 100), 30);
      ctx.fillStyle = "#00BE00";
      ctx.fillRect(9, 9, 214 * 0.8, 30);
    } else {
      ctx.fillStyle = "#00BE00";
      ctx.fillRect(9, 9, 214 * (+scoreText.textContent / 100), 30);
    }

    ctx.fillStyle = "#00B4FF";
    ctx.fillRect(9, 9, 214 * 0.6, 30);
  } else {
    ctx.fillStyle = "#00B4FF";
    ctx.fillRect(9, 9, 214 * (+scoreText.textContent / 100), 30);
  }

  ctx.drawImage(meter, 0, 0, 232, 48);
}

function updateText() {
  if (!scoreText) return;
  if (!pressText) return;
  if (!diffText) return;

  scoreText.textContent = Math.floor(badRounding(finalScore)).toString();
  pressText.textContent = "Presses: " + pressCounter.toString();
  if (finalScore != prevScore && prevScore !== undefined) {
    diffText.textContent = finalScore >= prevScore ? "+" : "";
    diffText.textContent += (badRounding(finalScore - prevScore)).toString();
  }

  const temp = document.createElement("table");
  temp.style.borderCollapse = "collapse";
  temp.style.font = "16px FOT-Seurat Pro";

  for (let i = 0; i < currCrit.length + 1; i++) {
    const row = temp.insertRow(-1);
    for (let j = 0; j < 6; j++) {
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
          if (i == 0) text = "name";
          else {
            text = currCrit[i - 1].name;
          }

          break;
        }
        case 1: {
          if (i == 0) text = "weight";
          else {
            text = currCrit[i - 1].weight + "%";
          }
          break;
        }
        case 2: {
          if (i == 0) text = "hit";
          else {
            text = currCrit[i - 1].hit.toString();
          }
          break;
        }
        case 3: {
          if (i == 0) text = "miss";
          else {
            text = (currCrit[i - 1].total - currCrit[i - 1].hit).toString();
          }
          break;
        }
        case 4: {
          if (i == 0) text = "total";
          else {
            text = currCrit[i - 1].total.toString();
          }
          break;
        }
        case 5: {
          if (i == 0) text = "result";
          else {
            text = badRounding(currCrit[i - 1].score).toString();
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
  return n > 0 ? Math.floor(n * 100) / 100 : Math.ceil(n * 100) / 100;
}

btnIcons.onload = () => updatePage();
pntIcons.onload = () => updatePage();
meter.onload = () => updatePage();

globalThis.addEventListener("resize", updatePage);

chartCanvas.addEventListener("mousemove", (e) => {
  selectX = Math.floor((e.offsetX - selectOffsetX) / 30);
  selectY = Math.floor(e.offsetY / 30);
  if (mouseFocus == 2 && selectY == currCrit.length + 1) {
    btnPressed[selectX] = drawState;
  }
  updatePage();
});

chartCanvas.addEventListener("mousedown", () => {
  mouseFocus = 1;
  if (selectY == currCrit.length + 1) {
    mouseFocus = 2;
    drawState = !btnPressed[selectX];
    btnPressed[selectX] = !btnPressed[selectX];
  }
  updatePage();
});

chartCanvas.addEventListener("mouseup", () => {
  mouseFocus = 0;
  updatePage();
});

chartCanvas.addEventListener("mouseleave", () => {
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
  canvas: HTMLCanvasElement,
): void {
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, ix * 30, iy * 30, 30, 30, x, y, 30, 30);
}
