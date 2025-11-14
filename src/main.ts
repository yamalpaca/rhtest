import btnimg from "./btnimg.png";
import { gameData } from "./gamedata.ts";
import meterimg from "./meterimg.png";
import pntimg from "./pntimg.png";
import "./style.css";

interface Criteria {
  id: number;
  name: string;
  weight: number;
  hits: number;
  score: number;
  total: number;
  result: number;
}

const critPal: string[] = [
  "#ABC8FF",
  "#AAFF9B",
  "#FF9D9D",
  "#F0BAFF",
  "#FFE002",
];

const gd = gameData[9];

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
let prevSelectX: number = -1;
let selectY: number = -1;
let prevSelectY: number = -1;
const selectOffsetX = 90;
let mouseFocus: number = 0;
const critData: Criteria[] = [];

let maxWidth: number;
const loadDist = 1;
let scrollX = 0;
let dragStartX: number;
let dragStartScrollX: number;

const btnPressed: boolean[] = Array(gd.inputs.length).fill(true);
const btnAccuracy: number[] = Array(gd.inputs.length).fill(100);
let drawState: boolean;
let drawAccState: number;

function updatePage(all: boolean) {
  if (all) {
    chartCanvas.width = (gd.inputs.length * tileSize) + selectOffsetX;

    if (chartCanvas.width > (40.5 * tileSize) + selectOffsetX) {
      chartCanvas.width = (40.5 * tileSize) + selectOffsetX;
    }

    if (chartCanvas.width > globalThis.innerWidth - 15) {
      chartCanvas.width = globalThis.innerWidth - 15;
    }
    chartCanvas.height = tileSize * (critData.length + 3);
    chartCanvas.style.borderRadius = "10px";

    maxWidth = Math.floor((chartCanvas.width - selectOffsetX) / tileSize);

    updateData();
    drawChartCanvas();
    updateText();
    drawMeterCanvas();
  }

  drawInterface();

  drawHeader();
}

function updateData() {
  critData.splice(0, critData.length);

  prevScore = finalScore;

  finalScore = 0;

  pressCounter = 0;

  for (let i: number = 0; i < gd.critweight.length; i++) {
    critData.push({
      id: i == gd.critweight.length - 1 ? 4 : i,
      name: i == gd.critweight.length - 1 ? "Skill Star" : gd.critname[i],
      weight: gd.critweight[i],
      hits: 0,
      score: 0,
      total: 0,
      result: 0,
    });
  }

  for (let i: number = 0; i < gd.inputs.length; i++) {
    critData[gd.inputs[i].criteria].total++;
    if (btnPressed[i]) {
      pressCounter++;
      critData[gd.inputs[i].criteria].hits++;
      critData[gd.inputs[i].criteria].score += btnAccuracy[i];
    }
  }

  critData.forEach((c: Criteria) => {
    c.result = badRounding(c.score / (c.total * 100)) * c.weight;
    finalScore += c.result;
  });
}

function drawHeader() {
  const ctx = chartCanvas.getContext("2d")!;
  if (!ctx) return;

  ctx.fillStyle = "#141414ff";
  ctx.fillRect(0, 0, selectOffsetX, chartCanvas.height);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(selectOffsetX - 1, 0);
  ctx.lineTo(selectOffsetX - 1, (critData.length + 3) * tileSize);
  ctx.stroke();

  for (let i: number = 0; i < critData.length; i++) {
    ctx.fillStyle = critPal[critData[i].id];
    ctx.fillRect(
      0,
      tileSize * (i + 1),
      selectOffsetX,
      tileSize,
    );

    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, (i + 2) * tileSize - 1);
    ctx.lineTo(
      selectOffsetX - 1,
      (i + 2) * tileSize - 1,
    );
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.letterSpacing = "1px";
    ctx.textAlign = "right";
    ctx.font = "12px Arial";
    ctx.fillText(
      critData[i].hits.toString() + "/" + critData[i].total.toString(),
      selectOffsetX - 32,
      (i + 2) * tileSize - 10,
    );

    drawIcon(
      selectOffsetX - tileSize - 1,
      (i + 1) * tileSize,
      0,
      critData[i].id,
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
    (critData.length + 2) * tileSize - 9,
  );
  ctx.fillText(
    "Timing",
    selectOffsetX - 7,
    (critData.length + 3) * tileSize - 9,
  );

  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(selectOffsetX - 1, tileSize);
  ctx.lineTo(selectOffsetX - 1, (critData.length + 1) * tileSize);
  ctx.stroke();
}

function drawChartCanvas() {
  const ctx = chartCanvas.getContext("2d")!;
  if (!ctx) return;

  ctx.fillStyle = "#141414ff";
  ctx.fillRect(
    selectOffsetX,
    0,
    gd.inputs.length * tileSize,
    tileSize,
  );

  for (let i: number = 0; i < critData.length; i++) {
    ctx.fillStyle = critPal[critData[i].id];
    ctx.fillRect(
      selectOffsetX,
      tileSize * (i + 1),
      gd.inputs.length * tileSize,
      tileSize,
    );

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(selectOffsetX, (i + 2) * tileSize - 1);
    ctx.lineTo(
      gd.inputs.length * tileSize + selectOffsetX,
      (i + 2) * tileSize - 1,
    );
    ctx.stroke();
  }

  ctx.fillStyle = "white";
  ctx.letterSpacing = "1px";
  ctx.textAlign = "center";
  ctx.font = "12px Arial";

  for (let i: number = -loadDist; i < maxWidth + loadDist + 1; i++) {
    const ioffset = i + Math.floor(scrollX / tileSize);

    if (!gd.inputs[ioffset]) continue;

    if ((ioffset % 5) == 4) {
      ctx.filter = "brightness(50%)";
      ctx.fillText(
        (ioffset + 1).toString(),
        (ioffset * tileSize) + selectOffsetX - scrollX + 15,
        15,
      );
    }

    ctx.filter = "brightness(100%)";
    const iindex = gd.inputs[ioffset].criteria == critData.length - 1
      ? 4
      : gd.inputs[ioffset].criteria;
    const itype = btnPressed[ioffset] ? 1 : 4;

    drawIcon(
      (i * tileSize) + selectOffsetX - (scrollX % 30),
      (gd.inputs[ioffset].criteria + 1) * tileSize,
      itype,
      iindex,
      pntIcons,
      chartCanvas,
    );
  }

  ctx.filter = "none";
}

function drawInterface() {
  const ctx = chartCanvas.getContext("2d")!;
  if (!ctx) return;

  ctx.fillStyle = "#141414ff";
  ctx.fillRect(
    selectOffsetX,
    tileSize * (critData.length + 1),
    gd.inputs.length * tileSize,
    tileSize * 2,
  );

  if (selectX > -1 && selectX < gd.inputs.length) {
    ctx.fillStyle = "#ffffff30";
    ctx.fillRect(
      ((selectX - Math.floor(scrollX / tileSize)) * tileSize) + selectOffsetX -
        (scrollX % 30),
      tileSize * (critData.length + 1),
      tileSize,
      tileSize * 2,
    );
  }

  for (let i: number = -loadDist; i < maxWidth + loadDist + 1; i++) {
    const ioffset = i + Math.floor(scrollX / tileSize);

    if (!gd.inputs[ioffset]) continue;

    ctx.filter = "brightness(100%)";

    if (selectX == ioffset && selectY == 0) {
      ctx.filter = "brightness(150%)";
      if (mouseFocus != 0) ctx.filter = "brightness(75%)";
    }

    if (!btnPressed[ioffset]) ctx.filter += "grayscale(100%)";

    drawIcon(
      (i * tileSize) + selectOffsetX - (scrollX % 30),
      (critData.length + 1) * tileSize,
      gd.inputs[ioffset].button,
      0,
      btnIcons,
      chartCanvas,
    );

    ctx.filter = "brightness(100%)";
    ctx.fillStyle = "white";
    ctx.letterSpacing = "1px";
    ctx.textAlign = "center";
    ctx.font = "12px Arial";

    if (!btnPressed[ioffset]) ctx.filter = "brightness(50%)";

    ctx.fillText(
      btnAccuracy[ioffset].toString(),
      (i * tileSize) + selectOffsetX + 15 - (scrollX % 30),
      (critData.length + 2) * tileSize + 20,
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

  scoreText.textContent = Math.floor(finalScore).toString();
  pressText.textContent = "Presses: " + pressCounter.toString();
  if (finalScore != prevScore && prevScore !== undefined) {
    diffText.textContent = finalScore >= prevScore ? "+" : "";
    diffText.textContent += (finalScore - prevScore).toString();
  }

  const temp = document.createElement("table");
  temp.style.borderCollapse = "collapse";
  temp.style.font = "16px FOT-Seurat Pro";

  for (let i = 0; i < critData.length + 1; i++) {
    const row = temp.insertRow(-1);
    for (let j = 0; j < 6; j++) {
      const cell = row.insertCell(-1);
      cell.style.border = "1px solid black";
      cell.style.textAlign = "center";
      cell.style.width = "120px";
      cell.style.height = "0px";
      cell.style.padding = "0px";

      let text = "";

      switch (j) {
        case 0: {
          cell.style.textAlign = "right";
          cell.style.width = "30px";
          cell.style.padding = "0px 8px 0px 8px";
          if (i > 0) {
            const miniCanvas = document.createElement("canvas");
            miniCanvas.width = 30;
            miniCanvas.height = 30;

            drawIcon(0, 0, 0, critData[i - 1].id, pntIcons, miniCanvas);
            cell.appendChild(miniCanvas);
          }

          break;
        }
        case 1: {
          cell.style.textAlign = "right";
          cell.style.width = "150px";
          cell.style.padding = "0px 8px 0px 8px";
          if (i == 0) text = "Name";
          else {
            text = critData[i - 1].name;
          }

          break;
        }
        case 2: {
          if (i == 0) text = "Weight";
          else {
            text = critData[i - 1].weight + "%";
          }
          break;
        }
        case 3: {
          if (i == 0) text = "Hit Score";
          else {
            text = critData[i - 1].score.toString();
          }
          break;
        }
        case 4: {
          if (i == 0) text = "Total Score";
          else {
            text = (critData[i - 1].total * 100).toString();
          }
          break;
        }
        case 5: {
          if (i == 0) text = "Result";
          else {
            text =
              (Math.floor(critData[i - 1].result * 10000) / 10000).toString() +
              "%";
          }
          break;
        }
      }

      if (j > 0) cell.appendChild(document.createTextNode(text));
    }
  }

  dataTable.replaceWith(temp);
  dataTable = temp;
}

function badRounding(n: number) {
  return n > 0 ? Math.floor(n * 10000) / 10000 : Math.ceil(n * 10000) / 10000;
}

btnIcons.onload = () => updatePage(true);
pntIcons.onload = () => updatePage(true);
meter.onload = () => updatePage(true);

globalThis.addEventListener("resize", updatePage.bind(null, true));

chartCanvas.addEventListener("mousemove", (e) => {
  if (mouseFocus == 5) {
    selectX = -1;
    selectY = -1;

    scrollX = dragStartScrollX + (dragStartX - e.offsetX);

    scrollX = Math.max(
      0,
      Math.min(
        scrollX,
        Math.max(
          0,
          gd.inputs.length * tileSize - (chartCanvas.width - selectOffsetX),
        ),
      ),
    );
    updatePage(true);
    return;
  }

  selectX =
    Math.floor((e.offsetX - selectOffsetX + (scrollX % 30)) / tileSize) +
    Math.floor(scrollX / tileSize);
  selectY = Math.floor(e.offsetY / 30) - critData.length - 1;

  document.body.style.cursor = "default";
  if (e.offsetX > selectOffsetX && selectY < 0) {
    document.body.style.cursor = "grab";
  }

  if (selectY < -1) selectY = -1;

  if (e.offsetX < selectOffsetX) {
    mouseFocus = 0;
    selectX = -1;
  }

  if (mouseFocus == 2 && selectY == 0) {
    btnPressed[selectX] = drawState;
    if (prevSelectX != selectX || prevSelectY != selectY) updatePage(true);
  } else if ((mouseFocus == 3 || mouseFocus == 4)) {
    btnAccuracy[selectX] = drawAccState;
    if (selectX != prevSelectX || selectY != 1) {
      mouseFocus = 4;
    }
    if (prevSelectX != selectX || prevSelectY != selectY) updatePage(true);
  } else {
    if (prevSelectX != selectX || prevSelectY != selectY) updatePage(false);
  }
  prevSelectX = selectX;
  prevSelectY = selectY;
});

chartCanvas.addEventListener("mousedown", (e) => {
  dragStartX = e.offsetX;
  dragStartScrollX = scrollX;
  mouseFocus = 5;
  document.body.style.cursor = "grabbing";

  if (e.offsetX < selectOffsetX) {
    mouseFocus = 1;
    return;
  }

  if (selectY > -1) document.body.style.cursor = "default";

  if (selectY == 0) {
    mouseFocus = 2;
    drawState = !btnPressed[selectX];
    btnPressed[selectX] = !btnPressed[selectX];
  } else if (selectY == 1) {
    mouseFocus = 3;
    drawAccState = btnAccuracy[selectX];
  }
  updatePage(true);
});

chartCanvas.addEventListener("mouseup", (e) => {
  if (mouseFocus == 5) {
    selectX =
      Math.floor((e.offsetX - selectOffsetX + (scrollX % 30)) / tileSize) +
      Math.floor(scrollX / tileSize);
    selectY = Math.floor(e.offsetY / 30) - critData.length - 1;
  }

  if (mouseFocus == 3 && btnPressed[selectX]) {
    const newNum = prompt(
      "Enter number 0-100",
      btnAccuracy[selectX].toString(),
    );
    if (!isNaN(Number(newNum))) btnAccuracy[selectX] = Number(newNum);
  }
  mouseFocus = 0;
  updatePage(true);
});

chartCanvas.addEventListener("mouseleave", () => {
  document.body.style.cursor = "default";
  selectX = -1;
  selectY = -1;
  prevSelectX = selectX;
  prevSelectY = selectY;
  mouseFocus = 0;
  updatePage(false);
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
