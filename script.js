const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const levelDisplay = document.getElementById('level');
const startBtn = document.getElementById('start-btn');
const fireworksContainer = document.getElementById('fireworks');
const celebrationMusic = document.getElementById('celebration-music');

let score = 0;
let timeLeft = 50;
let level = 1;
let circleLifetime = 2000; // 圆圈的消失时间，初始为2秒
let circleSpawnInterval = 1000; // 圆圈生成间隔，初始为1秒
let targetScore = 50; // 过关分数，初始为50分
let gameInterval;
let timerInterval;

// 随机生成圆圈
function createCircle() {
  const circle = document.createElement('div');
  circle.classList.add('circle');
  const size = Math.floor(Math.random() * 50 + 30); // 随机大小
  const x = Math.floor(Math.random() * (gameArea.offsetWidth - size));
  const y = Math.floor(Math.random() * (gameArea.offsetHeight - size));
  const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  circle.style.backgroundColor = color;

  // 点击圆圈得分
  circle.addEventListener('click', () => {
    score += 3; // 点击得3分
    scoreDisplay.textContent = `得分: ${score}`;
    gameArea.removeChild(circle);
    checkWin(); // 检查是否过关
  });

  // 圆圈自动消失（未点击扣分）
  setTimeout(() => {
    if (gameArea.contains(circle)) {
      gameArea.removeChild(circle);
      score -= 1; // 未点击扣1分
      scoreDisplay.textContent = `得分: ${score}`;
    }
  }, circleLifetime); // 根据关卡调整消失时间

  gameArea.appendChild(circle);
}

// 检查是否过关
function checkWin() {
  if (score >= targetScore) {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    startBtn.disabled = false;
    showFireworks(); // 显示烟花动画
    celebrationMusic.play(); // 播放庆祝音乐
    alert(`恭喜你过关啦！🎉 进入第 ${level + 1} 关！`);
    level++;
    levelDisplay.textContent = `关卡: ${level}`;
    increaseDifficulty(); // 增加难度
    startGame(); // 自动进入下一关
  }
}

// 增加难度
function increaseDifficulty() {
  circleLifetime -= 200; // 每关减少200毫秒的消失时间
  circleSpawnInterval -= 100; // 每关减少100毫秒的生成间隔
  targetScore += 10; // 每关增加10分过关分数
}

// 显示烟花动画
function showFireworks() {
  for (let i = 0; i < 50; i++) {
    const firework = document.createElement('div');
    firework.classList.add('firework');
    firework.style.left = `${Math.random() * 100}vw`;
    firework.style.top = `${Math.random() * 100}vh`;
    firework.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    fireworksContainer.appendChild(firework);

    // 移除烟花元素
    setTimeout(() => {
      firework.remove();
    }, 1000);
  }
}

// 开始游戏
function startGame() {
  score = 0;
  timeLeft = 50;
  scoreDisplay.textContent = `得分: ${score}`;
  timerDisplay.textContent = `时间: ${timeLeft} 秒`;
  startBtn.disabled = true;

  // 清除烟花
  fireworksContainer.innerHTML = '';

  // 每隔一定时间生成一个圆圈
  gameInterval = setInterval(createCircle, circleSpawnInterval);

  // 倒计时
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `时间: ${timeLeft} 秒`;

    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
      startBtn.disabled = false;
      alert(`游戏结束！你的得分是: ${score}`);
    }
  }, 1000);
}

startBtn.addEventListener('click', startGame);