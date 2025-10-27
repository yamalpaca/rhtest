import "./style.css";

document.body.innerHTML = `
`;

const canvas = document.createElement("canvas");
document.body.append(canvas);

const ctx = canvas.getContext("2d")!;

const tileSize: number = 30;


const chartWidth = 19;
const chartHeight = 5;


const rowPal: string[] = [
  "#FF9D9D",
  "#FFC668",
  "#AAFF9B",
  "#F0BAFF",
  "#FFE002",
];
const inputPal: string = "#3d3d3dff";

function resizeCanvas() {
  canvas.width = globalThis.innerWidth - 40;
  canvas.height = (tileSize * chartHeight) + 50;

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i: number = 0; i < chartHeight; i++) {
      ctx.fillStyle = rowPal[i];
      ctx.fillRect(0, tileSize * i, chartWidth*30, tileSize);
    }

    ctx.fillStyle = inputPal;
    ctx.fillRect(0, tileSize * chartHeight, chartWidth*30, 50);

    ctx.fillStyle = "#000000";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < chartHeight; i += 1) {
      ctx.beginPath();
      ctx.moveTo(0, (i*30)+29);
      ctx.lineTo(chartWidth*30, (i*30)+29);
      ctx.stroke();
    }
  }
}

resizeCanvas();

globalThis.addEventListener("resize", resizeCanvas);
