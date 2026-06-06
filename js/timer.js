/* ============================================
   MoodSync Timer — Pomodoro Study Timer
   ============================================ */

let timerInterval = null;
let timerSeconds = 0;
let timerTotal = 0;
let timerRunning = false;
let timerPaused = false;

function initTimer(minutes) {
  clearInterval(timerInterval);
  timerSeconds = minutes * 60;
  timerTotal = timerSeconds;
  timerRunning = false;
  timerPaused = false;
  updateTimerDisplay();
  updateTimerRing();
  updateTimerButtons();
}

function startTimer() {
  if (timerRunning && !timerPaused) return;

  if (timerSeconds <= 0) {
    initTimer(getDefaultTimer());
  }

  timerRunning = true;
  timerPaused = false;
  updateTimerButtons();

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    updateTimerRing();

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      onTimerComplete();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerPaused = true;
  timerRunning = true;
  updateTimerButtons();
}

function resetTimer() {
  clearInterval(timerInterval);
  initTimer(Math.round(timerTotal / 60));
}

function onTimerComplete() {
  // Play completion sound
  playTimerSound();

  // Track session
  const minutes = Math.round(timerTotal / 60);
  addStudySession(minutes);

  showToast(`🎉 ${minutes}-minute study session completed!`, 'success');

  // Update quote
  const quoteEl = document.getElementById('timer-quote-text');
  if (quoteEl) {
    quoteEl.textContent = getRandomQuote();
  }

  updateTimerButtons();
}

function playTimerSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.2 + 0.5);
      osc.start(audioCtx.currentTime + i * 0.2);
      osc.stop(audioCtx.currentTime + i * 0.2 + 0.5);
    });
  } catch (e) {
    // Audio not supported
  }
}

function updateTimerDisplay() {
  const display = document.getElementById('timer-time');
  if (display) {
    display.textContent = formatTime(timerSeconds);
  }

  const label = document.getElementById('timer-label');
  if (label) {
    if (!timerRunning && !timerPaused) {
      label.textContent = 'Ready to focus';
    } else if (timerPaused) {
      label.textContent = 'Paused';
    } else {
      label.textContent = 'Stay focused...';
    }
  }
}

function updateTimerRing() {
  const ring = document.getElementById('timer-ring-progress');
  if (!ring) return;

  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const progress = timerTotal > 0 ? timerSeconds / timerTotal : 1;
  const offset = circumference * (1 - progress);

  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = offset;
}

function updateTimerButtons() {
  const startBtn = document.getElementById('timer-start');
  const pauseBtn = document.getElementById('timer-pause');
  const resetBtn = document.getElementById('timer-reset');

  if (startBtn) {
    startBtn.disabled = timerRunning && !timerPaused;
    startBtn.textContent = timerPaused ? '▶ Resume' : '▶ Start';
  }
  if (pauseBtn) {
    pauseBtn.disabled = !timerRunning || timerPaused;
  }
  if (resetBtn) {
    resetBtn.disabled = !timerRunning && timerSeconds === timerTotal;
  }
}

function setTimerPreset(minutes) {
  initTimer(minutes);
  // Update active preset button
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.minutes) === minutes);
  });
}
