import btnIcons from './btnicons.png';
import './style.css';

document.body.innerHTML = `
`;

const canvas = document.createElement('canvas');
document.body.append(canvas);

const ctx = canvas.getContext('2d')!;

const tileSize: number = 30;



const rowPal: string[] = [
  '#FF9D9D',
  '#FFC668',
  '#AAFF9B',
  '#F0BAFF',
  '#FFE002',
];
const inputPal: string = '#141414ff';

const myImage = new Image();
myImage.src = btnIcons;

let selectX: number = -1;
let selectY: number = -1;
const selectOffsetX = 86;

interface Game {
  inputLength: number;
  critAmt: number;
  critNames: string[];
}

const gameData: Game = {
  inputLength: 19,
  critAmt: 5,
  critNames: ['A', 'B', 'C', 'D'],
};


function drawCanvas() {
  

  canvas.width = globalThis.innerWidth - 40;
  canvas.height = (tileSize * (gameData.critAmt+1)) + 50;

  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 0.5;

  for (let i: number = 0; i < gameData.critAmt; i++) {
    
    ctx.fillStyle = rowPal[i];
    ctx.fillRect(0, tileSize * i, (gameData.inputLength * 30)+selectOffsetX, tileSize);

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(0, (i * 30) + 29);
    ctx.lineTo((gameData.inputLength * 30)+selectOffsetX, (i * 30) + 29);
    ctx.stroke();


    ctx.fillStyle = 'black';
    ctx.font = '16px FOT-Seurat Pro';
    ctx.textAlign = 'right';

    if (i == gameData.critAmt-1) { 
      ctx.fillText('Skill Star', selectOffsetX-6, (i*30)+20);
    } else {
      ctx.fillText(gameData.critNames[i], selectOffsetX-6, (i*30)+20);
    }
  }

  ctx.fillStyle = inputPal;
  ctx.fillRect(0, tileSize * gameData.critAmt, (gameData.inputLength * 30)+selectOffsetX, 50);
  ctx.fillStyle = 'white';
  ctx.fillText('Buttons', selectOffsetX-6, (gameData.critAmt*30)+20);



  for (let i: number = 0; i < gameData.inputLength; i++){
    if (selectX == i && selectY == gameData.critAmt) {
      ctx.filter = 'brightness(175%)';
    } else {
      ctx.filter = 'brightness(100%)';
    }
    drawButton((i*tileSize)+selectOffsetX, gameData.critAmt * tileSize, 1);
  }
  ctx.filter = 'none';


  
  
}

myImage.onload = () => drawCanvas();

globalThis.addEventListener('resize', drawCanvas);

canvas.addEventListener('mousemove', (e) => {
  selectX = Math.floor((e.offsetX-selectOffsetX) / 30);
  selectY = Math.floor(e.offsetY / 30);
  drawCanvas();
});

canvas.addEventListener('mouseleave', () => {
  selectX = -1;
  selectY = -1;
  drawCanvas();
});


function drawButton(x: number, y: number, index: number): void {
  
  ctx.drawImage(myImage, index * 30, 0, 30, 30, x, y, 30, 30);
}

