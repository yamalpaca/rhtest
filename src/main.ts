import "./style.css";

document.body.innerHTML = `
`;

const canvas = document.createElement("canvas");
document.body.append(canvas);

const ctx = canvas.getContext("2d")!;

const tileSize: number = 30;

function resizeCanvas() {
  canvas.width = globalThis.innerWidth - 40;
  canvas.height = (tileSize * 8) + 50;

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "gray";
    for (let i: number = 0; i < 4; i++) {
      ctx.fillRect(0, tileSize * i * 2, canvas.width, tileSize);
    }
    ctx.fillRect(0, 240, canvas.width, 50);
  }
}

resizeCanvas();

globalThis.addEventListener("resize", resizeCanvas);
