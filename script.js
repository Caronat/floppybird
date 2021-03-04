const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./media/flappy-bird-set.png";
const eltBestScore = document.getElementById("bestScore");
const eltCurrentScore = document.getElementById("currentScore");

// general settings
const gravity = 0.5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = canvas.width / 10;

// pipe settings
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () =>
  Math.random() * (canvas.height - pipeGap - 2 * pipeWidth) + pipeWidth;

let gamePlaying = false;
let index = 0;
let bestScore = 0;
let currentScore = 0;
let pipes = [];
let flight = 0;
let flyHeight = (canvas.height - size[1]) / 2;

const setup = () => {
  currentScore = 0;
  flight = jump;
  flyHeight = (canvas.height - size[1]) / 2;

  pipes = Array(3)
    .fill()
    .map((_, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);

  console.log(pipes);
};

const drawBackground = () => {
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * speed) / 2) % canvas.width,
    0,
    canvas.width,
    canvas.height
  );
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    (-((index * speed) / 2) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );
};
const drawBird = () => {
  ctx.drawImage(
    img,
    432,
    ~~((index / 3) % 3) * size[1],
    ...size,
    gamePlaying ? cTenth : (canvas.width - size[0]) / 2,
    flyHeight,
    ...size
  );
};
const drawScore = () => {
  if (!gamePlaying) {
    ctx.font = "bold 30px courier";
    ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
    ctx.fillText(`Cliquez pour jouer`, 48, 535);
  }
};
const drawPipes = () => {
  if (gamePlaying) {
    pipes.map((pipe) => {
      //top pipe
      ctx.drawImage(
        img,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );
      //bottum pipe
      ctx.drawImage(
        img,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      );
    });
  }
};
const majScore = () => {
  currentScore++;
  bestScore = Math.max(bestScore, currentScore);
};

const render = () => {
  index++;

  if (gamePlaying) {
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);

    pipes.map((pipe) => {
      // move pipe
      pipe[0] -= speed;
      // remove + add pipe
      if (pipe[0] <= -pipeWidth) {
        majScore();
        //remove piep + create next pipe
        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ];
      }
      // if hit the pipe, end
      if (
        [
          pipe[0] <= cTenth + size[0],
          pipe[0] + pipeWidth >= cTenth,
          pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1],
        ].every((e) => e)
      ) {
        gamePlaying = false;
        setup();
      }
    });
  }

  drawBackground();
  drawScore();
  drawBird();
  drawPipes();
  
  eltBestScore.innerHTML = `Meilleur : ${bestScore}`;
  eltCurrentScore.innerHTML = `Actuel : ${currentScore}`;

  window.requestAnimationFrame(render);
};

setup();
img.onload = render;
document.addEventListener("click", () => (gamePlaying = true));
window.onclick = () => (flight = jump);
