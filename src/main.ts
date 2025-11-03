import btnIcons from "./btnicons.png";
import "./style.css";

document.body.innerHTML = `
`;

const canvas = document.createElement("canvas");
document.body.append(canvas);

const ctx = canvas.getContext("2d")!;

const tileSize: number = 30;

const rowPal: string[] = [
  "#FF9D9D",
  "#FFC668",
  "#AAFF9B",
  "#F0BAFF",
  "#FFE002",
];
const inputPal: string = "#141414ff";

const myImage = new Image();
myImage.src = btnIcons;

let selectX: number = -1;
let selectY: number = -1;
const selectOffsetX = 130;
let mouseFocus: number = 0;

interface Game {
  inputLength: number;
  critAmt: number;
  critNames: string[];
}

const gameData: Game = {
  inputLength: 19,
  critAmt: 5,
  critNames: ["A", "B", "C", "D"],
};

const btnPressed: boolean[] = Array(gameData.inputLength).fill(true);
let drawState: boolean;

function drawCanvas() {
  canvas.width = globalThis.innerWidth - 40;
  canvas.height = (tileSize * (gameData.critAmt + 1)) + 30;

  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i: number = 0; i < gameData.critAmt; i++) {
    ctx.fillStyle = rowPal[i];
    ctx.fillRect(
      0,
      tileSize * i,
      (gameData.inputLength * 30) + selectOffsetX + 1,
      tileSize,
    );

    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, (i * 30) + 29);
    ctx.lineTo((gameData.inputLength * 30) + selectOffsetX + 1, (i * 30) + 29);
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "16px FOT-Seurat Pro";
    ctx.letterSpacing = "1px";
    ctx.textAlign = "right";

    if (i == gameData.critAmt - 1) {
      ctx.fillText("Skill Star", selectOffsetX - 8, (i * 30) + 21);
    } else {
      ctx.fillText(gameData.critNames[i], selectOffsetX - 8, (i * 30) + 21);
    }
  }

  ctx.fillStyle = inputPal;
  ctx.fillRect(
    0,
    tileSize * gameData.critAmt,
    (gameData.inputLength * 30) + selectOffsetX + 1,
    60,
  );
  ctx.fillStyle = "white";
  ctx.fillText("Buttons", selectOffsetX - 8, (gameData.critAmt * 30) + 21);
  ctx.fillText("Timing", selectOffsetX - 8, (gameData.critAmt * 30) + 51);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(selectOffsetX - 2, 0);
  ctx.lineTo(selectOffsetX - 2, gameData.critAmt * 30);
  ctx.stroke();
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(selectOffsetX - 2, gameData.critAmt * 30);
  ctx.lineTo(selectOffsetX - 2, (gameData.critAmt * 30) + 60);
  ctx.stroke();

  if (selectX > -1 && selectX < gameData.inputLength) {
    ctx.fillStyle = "#ffffff30";
    ctx.fillRect(
      (selectX * tileSize) + selectOffsetX,
      tileSize * gameData.critAmt,
      tileSize,
      60,
    );
  }

  for (let i: number = 0; i < gameData.inputLength; i++) {
    if (selectX == i && selectY == gameData.critAmt) {
      ctx.filter = "brightness(150%)";
      if (mouseFocus != 0) ctx.filter = "brightness(75%)";
    } else {
      ctx.filter = "brightness(100%)";
    }

    if (!btnPressed[i]) {
      ctx.filter += "grayscale(100%)";
    }

    drawButton((i * tileSize) + selectOffsetX, gameData.critAmt * tileSize, 1);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.letterSpacing = "0px";
    ctx.filter = "none";
    ctx.fillText(
      "0",
      (i * tileSize) + selectOffsetX + 15,
      ((gameData.critAmt + 1) * tileSize) + 21,
    );
  }
  ctx.filter = "none";
}

myImage.onload = () => drawCanvas();

globalThis.addEventListener("resize", drawCanvas);

canvas.addEventListener("mousemove", (e) => {
  selectX = Math.floor((e.offsetX - selectOffsetX) / 30);
  selectY = Math.floor(e.offsetY / 30);
  if (mouseFocus == 2 && selectY == gameData.critAmt) {
    btnPressed[selectX] = drawState;
  }
  drawCanvas();
});

canvas.addEventListener("mousedown", () => {
  mouseFocus = 1;
  if (selectY == gameData.critAmt) {
    mouseFocus = 2;
    drawState = !btnPressed[selectX];
    btnPressed[selectX] = !btnPressed[selectX];
  }
  drawCanvas();
});

canvas.addEventListener("mouseup", () => {
  mouseFocus = 0;
  drawCanvas();
});

canvas.addEventListener("mouseleave", () => {
  selectX = -1;
  selectY = -1;
  drawCanvas();
});

function drawButton(x: number, y: number, index: number): void {
  ctx.drawImage(myImage, index * 30, 0, 30, 30, x, y, 30, 30);
}
