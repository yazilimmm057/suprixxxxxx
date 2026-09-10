/* ==========================================================================
   CEREN'S UNIVERSE - 70s RETRO ROMANTIC INTERACTIVE ENGINE
   Features:
   - Real Rising Floating Message Balloons (En alttan en üste süzülen balonlar)
   - Dynamic Hold-to-Grow Heart Engine
   - Flirt Spin Wheel (Flört Çarkıfeleği)
   - Scratch-off Card (Kazı-Kazan Aşk Notu)
   - Chemistry & Compatibility Quiz (Uyum Testi)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDynamicGrowingHeartEngine();
  initRetroParticleCanvas();
  initRetroAudioSynthesizer();
  initAcrosticPoetry();
  initTypewriterQuestionBox();
  initFlirtSpinWheel();
  initScratchCard();
  initChemistryQuiz();
  initSweetnessSlider();
  initFortuneCookie();
  initBucketList();
  initPhotoLightbox();
  initEnvelopeModal();
});

/* --------------------------------------------------------------------------
   1. DYNAMIC TAP & HOLD HEART GROWTH ENGINE (PRESS LONGER FOR BIGGER HEART)
   -------------------------------------------------------------------------- */
function initDynamicGrowingHeartEngine() {
  const container = document.getElementById('interactive-hearts-layer');
  if (!container) return;

  let activeHeart = null;
  let growStartTime = 0;
  let growAnimId = null;
  let currentScale = 1;
  let holdAudioOsc = null;
  let holdAudioGain = null;

  function startHeart(x, y) {
    if (activeHeart) removeActiveHeart();

    growStartTime = Date.now();
    currentScale = 1;

    activeHeart = document.createElement('div');
    activeHeart.className = 'growing-heart-node';
    activeHeart.textContent = '❤️';
    activeHeart.style.left = `${x}px`;
    activeHeart.style.top = `${y}px`;
    container.appendChild(activeHeart);

    startAscendingTone();

    function growLoop() {
      const elapsed = (Date.now() - growStartTime) / 1000;
      currentScale = Math.min(8.5, 1 + elapsed * 2.8 + Math.pow(elapsed, 1.6) * 0.8);
      
      if (activeHeart) {
        activeHeart.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
        const glowRadius = Math.min(60, 20 + currentScale * 6);
        activeHeart.style.filter = `drop-shadow(0 0 ${glowRadius}px rgba(234, 115, 150, 0.9)) drop-shadow(0 0 ${glowRadius / 2}px rgba(249, 178, 51, 0.7))`;
        updateAscendingTone(currentScale);
      }

      growAnimId = requestAnimationFrame(growLoop);
    }

    growAnimId = requestAnimationFrame(growLoop);
  }

  function releaseHeart() {
    if (!activeHeart) return;

    cancelAnimationFrame(growAnimId);
    stopAscendingTone();

    const heartToPop = activeHeart;
    const finalScale = currentScale;
    activeHeart = null;

    heartToPop.style.setProperty('--target-scale', finalScale);
    heartToPop.classList.add('popping');

    const rect = heartToPop.getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height / 2) / window.innerHeight;
    const burstCount = Math.min(100, Math.floor(finalScale * 12));

    if (window.confetti) {
      window.confetti({
        particleCount: burstCount,
        spread: Math.min(120, 45 + finalScale * 10),
        origin: { x: originX, y: originY },
        colors: ['#ea7396', '#f9b233', '#e76f51', '#f4c2cb', '#fff']
      });
    }

    playChime(Math.min(900, 440 + finalScale * 50), 'sine', 0.6);

    setTimeout(() => {
      if (heartToPop && heartToPop.parentNode) {
        heartToPop.parentNode.removeChild(heartToPop);
      }
    }, 1300);
  }

  function removeActiveHeart() {
    if (activeHeart) {
      cancelAnimationFrame(growAnimId);
      stopAscendingTone();
      if (activeHeart.parentNode) {
        activeHeart.parentNode.removeChild(activeHeart);
      }
      activeHeart = null;
    }
  }

  function startAscendingTone() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();

      holdAudioOsc = audioCtx.createOscillator();
      holdAudioGain = audioCtx.createGain();

      holdAudioOsc.type = 'sine';
      holdAudioOsc.frequency.setValueAtTime(330, audioCtx.currentTime);
      holdAudioGain.gain.setValueAtTime(0.06, audioCtx.currentTime);

      holdAudioOsc.connect(holdAudioGain);
      holdAudioGain.connect(audioCtx.destination);
      holdAudioOsc.start();
    } catch (e) {}
  }

  function updateAscendingTone(scale) {
    if (holdAudioOsc && audioCtx) {
      const targetFreq = Math.min(750, 330 + scale * 55);
      holdAudioOsc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.05);
    }
  }

  function stopAscendingTone() {
    try {
      if (holdAudioGain && audioCtx) {
        holdAudioGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
        setTimeout(() => {
          if (holdAudioOsc) {
            try { holdAudioOsc.stop(); } catch(e) {}
            holdAudioOsc = null;
          }
        }, 120);
      }
    } catch (e) {}
  }

  window.addEventListener('pointerdown', (e) => {
    const isInteractive = e.target.closest('input, textarea, button, a, canvas, .bucket-item-70s, .tag-70s, .modal-overlay, .floating-message-balloon');
    if (isInteractive && !e.target.closest('#particle-canvas, body, .hero-section, .app-wrapper')) {
      return;
    }
    startHeart(e.clientX, e.clientY);
  });

  window.addEventListener('pointerup', releaseHeart);
  window.addEventListener('pointercancel', releaseHeart);
}

/* --------------------------------------------------------------------------
   2. RISING FLOATING MESSAGE BALLOONS (EN ALTTAN EN ÜSTE SÜZÜLEN BALONLAR)
   -------------------------------------------------------------------------- */
function spawnRisingBalloon(text) {
  const container = document.getElementById('floating-balloons-container');
  if (!container) return;

  const balloon = document.createElement('div');
  balloon.className = 'floating-message-balloon';

  // Random horizontal position across screen (with safety padding)
  const randomX = Math.random() * (window.innerWidth - 240) + 20;
  balloon.style.left = `${randomX}px`;

  balloon.innerHTML = `
    <div class="balloon-text">"${text}"</div>
    <div class="balloon-heart-tag">❤️ Ceren'in Mesajı</div>
    <div class="balloon-string"></div>
  `;

  // Click to pop balloon with sound & confetti
  balloon.addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = balloon.getBoundingClientRect();
    if (window.confetti) {
      window.confetti({
        particleCount: 50,
        spread: 80,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight
        },
        colors: ['#ea7396', '#f9b233', '#e76f51', '#fff']
      });
    }
    playChime(659.25, 'triangle', 0.5);
    balloon.remove();
  });

  container.appendChild(balloon);

  // Auto remove after rising animation ends
  setTimeout(() => {
    if (balloon && balloon.parentNode) {
      balloon.remove();
    }
  }, 14500);
}

/* --------------------------------------------------------------------------
   3. TYPEWRITER QUESTION BOX (MÜHÜRLE & BALONLA GÖNDER)
   -------------------------------------------------------------------------- */
function initTypewriterQuestionBox() {
  const form = document.getElementById('question-form');
  const input = document.getElementById('question-input');
  const toast = document.getElementById('question-response-toast');
  const toastBody = document.getElementById('toast-body');
  const historyContainer = document.getElementById('questions-history');
  const tags = document.querySelectorAll('.tag-70s');

  const savedQuestions = JSON.parse(localStorage.getItem('ceren_70s_questions') || '[]');
  renderHistory(savedQuestions);

  tags.forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.stopPropagation();
      input.value = tag.getAttribute('data-q');
      input.focus();
      playChime(523.25, 'triangle', 0.2);
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const val = input.value.trim();
      if (!val) return;

      playChime(659.25, 'sine', 0.9);

      // 1. Spawn Rising Balloon from bottom to top of website!
      spawnRisingBalloon(val);

      // Save to local storage
      savedQuestions.unshift({ text: val, time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) });
      localStorage.setItem('ceren_70s_questions', JSON.stringify(savedQuestions));
      renderHistory(savedQuestions);

      // Confetti burst
      if (window.confetti) {
        window.confetti({
          particleCount: 45,
          spread: 75,
          origin: { y: 0.75 },
          colors: ['#ea7396', '#f9b233', '#e76f51']
        });
      }

      const responses = [
        `"Harika bir soru Ceren! '${val}' sorunu kalbime mühürledim ve gökyüzüne doğru süzülen balonla gönderdim! ❤️"`,
        `"Senin benim için konfor alanından çıkıp soru sorman o kadar tatlı ki! Balonun şimdi süzülüyor ✨"`,
        `"Zihnindeki tüm düşünceler benim için çok değerli. Mesajını balonla gökyüzüne bıraktık 💕"`
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      toastBody.textContent = randomResponse;
      toast.style.display = 'block';

      input.value = '';
    });
  }

  function renderHistory(list) {
    if (!historyContainer) return;
    if (list.length === 0) {
      historyContainer.innerHTML = '';
      return;
    }
    historyContainer.innerHTML = `
      <div style="font-family: var(--font-serif); font-style: italic; font-size: 0.95rem; color: #87233c; margin-top: 1rem; font-weight: bold;">
        ✉️ Mühürlenen Soruların (${list.length}):
      </div>
      ${list.slice(0, 5).map(q => `
        <div style="background: #fff; border: 1px solid #d4c2a8; padding: 10px 14px; border-radius: 6px; font-family: var(--font-serif); font-style: italic; font-size: 1.05rem; color: #26101f;">
          <span>"${q.text}"</span>
          <span style="font-size: 0.8rem; color: #9d2b45; float: right;">${q.time}</span>
        </div>
      `).join('')}
    `;
  }
}

/* --------------------------------------------------------------------------
   4. FLIRT SPIN WHEEL (FLÖRT ÇARKIFELEĞİ)
   -------------------------------------------------------------------------- */
function initFlirtSpinWheel() {
  const canvas = document.getElementById('flirt-wheel-canvas');
  const spinBtn = document.getElementById('spin-wheel-btn');
  const resultText = document.getElementById('wheel-result-text');
  if (!canvas || !spinBtn) return;

  const ctx = canvas.getContext('2d');
  const segments = [
    { text: "7 Saat Sohbet #2 🎧", color: "#e76f51" },
    { text: "En Sevdiğin Şarkı 🎵", color: "#f9b233" },
    { text: "3 Çılgın Soru Sor ❓", color: "#ea7396" },
    { text: "Sabri'den İltifat 💖", color: "#c85a53" },
    { text: "Ortak Playlist 🎶", color: "#e8c371" },
    { text: "Bir Dilek Tut ✨", color: "#b8405e" }
  ];

  const numSegments = segments.length;
  const arcSize = (2 * Math.PI) / numSegments;
  let currentRotation = 0;
  let isSpinning = false;

  function drawWheel() {
    ctx.clearRect(0, 0, 260, 260);
    const centerX = 130;
    const centerY = 130;
    const radius = 120;

    for (let i = 0; i < numSegments; i++) {
      const angle = i * arcSize;
      ctx.beginPath();
      ctx.fillStyle = segments[i].color;
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "italic bold 12px 'Plus Jakarta Sans', sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 4;
      ctx.fillText(segments[i].text, radius - 12, 5);
      ctx.restore();
    }
  }

  drawWheel();

  spinBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isSpinning) return;
    isSpinning = true;

    playChime(440, 'triangle', 0.5);

    // Random spin between 5 and 9 full rotations + offset
    const randomRotations = 5 + Math.floor(Math.random() * 4);
    const randomSegmentIndex = Math.floor(Math.random() * numSegments);
    const targetAngle = (randomRotations * 360) + (randomSegmentIndex * (360 / numSegments)) + (360 / numSegments / 2);

    currentRotation += targetAngle;
    canvas.style.transform = `rotate(${currentRotation}deg)`;
    resultText.textContent = "Çark dönüyor... 🌀";

    setTimeout(() => {
      isSpinning = false;
      // Calculate which segment is at top (270 degrees)
      const normalizedAngle = (360 - (currentRotation % 360) + 270) % 360;
      const winningIndex = Math.floor(normalizedAngle / (360 / numSegments)) % numSegments;
      const winner = segments[winningIndex];

      resultText.textContent = `🎯 Sonuç: ${winner.text}`;

      playChime(659.25, 'sine', 1.0);
      if (window.confetti) {
        window.confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      }
    }, 4000);
  });
}

/* --------------------------------------------------------------------------
   5. SCRATCH-OFF CARD (KAZI-KAZAN AŞK NOTU)
   -------------------------------------------------------------------------- */
function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  const resetBtn = document.getElementById('reset-scratch-btn');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let isScratchedEnough = false;

  function initFoil() {
    ctx.globalCompositeOperation = 'source-over';
    // Gold metallic gradient foil
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#d4a359');
    grad.addColorStop(0.5, '#f9b233');
    grad.addColorStop(1, '#e76f51');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = "italic bold 16px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.fillText("✨ PARMAĞINLA KAZI ✨", canvas.width / 2, canvas.height / 2 - 5);
    ctx.font = "italic 12px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("Gizli Sevgi Notunu Gör", canvas.width / 2, canvas.height / 2 + 18);

    ctx.globalCompositeOperation = 'destination-out';
    isScratchedEnough = false;
  }

  initFoil();

  function scratch(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Check scratch percentage occasionally
    if (!isScratchedEnough && Math.random() > 0.6) {
      checkScratchPercentage();
    }
  }

  function checkScratchPercentage() {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] === 0) transparentPixels++;
    }
    const percent = (transparentPixels / (canvas.width * canvas.height)) * 100;
    if (percent > 45 && !isScratchedEnough) {
      isScratchedEnough = true;
      playChime(783.99, 'sine', 1.0);
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      }
    }
  }

  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  canvas.addEventListener('mousedown', (e) => { isDrawing = true; const p = getCoords(e); scratch(p.x, p.y); });
  canvas.addEventListener('mousemove', (e) => { if (isDrawing) { const p = getCoords(e); scratch(p.x, p.y); } });
  window.addEventListener('mouseup', () => isDrawing = false);

  canvas.addEventListener('touchstart', (e) => { isDrawing = true; const p = getCoords(e); scratch(p.x, p.y); }, { passive: true });
  canvas.addEventListener('touchmove', (e) => { if (isDrawing) { const p = getCoords(e); scratch(p.x, p.y); } }, { passive: true });
  window.addEventListener('touchend', () => isDrawing = false);

  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      initFoil();
      playChime(523.25, 'triangle', 0.3);
    });
  }
}

/* --------------------------------------------------------------------------
   6. FLIRT CHEMISTRY QUIZ (CEREN & SABRİ UYUM TESTİ)
   -------------------------------------------------------------------------- */
function initChemistryQuiz() {
  const container = document.getElementById('quiz-container');
  const title = document.getElementById('quiz-question-title');
  const options = document.getElementById('quiz-options');
  const restartBtn = document.getElementById('restart-quiz-btn');
  if (!container || !title || !options) return;

  const questions = [
    {
      q: "1. Gece 02:00'de telefon çalsa ne yaparsın?",
      opts: ["A) 7 saat daha konuşurum!", "B) Ceren sorar, ben dinlerim ❤️"]
    },
    {
      q: "2. İlk buluşmada nereye gidelim?",
      opts: ["A) 70'ler retro konseptli bir kafe ☕", "B) Yıldızları izleyebileceğimiz sakin bir yer ✨"]
    },
    {
      q: "3. Ceren'in sürekli sorular sorması?",
      opts: ["A) Dünyanın en tatlı şeyi 💕", "B) Saatlerce dinlemeye doyamam 🚀"]
    }
  ];

  let currentStep = 0;

  function renderStep() {
    if (currentStep < questions.length) {
      const q = questions[currentStep];
      title.textContent = q.q;
      options.innerHTML = q.opts.map((opt, i) => `
        <button class="quiz-btn-option" data-idx="${i}">${opt}</button>
      `).join('');

      options.querySelectorAll('.quiz-btn-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          playChime(587.33 + currentStep * 80, 'sine', 0.4);
          currentStep++;
          renderStep();
        });
      });
    } else {
      // Quiz Finished Result
      title.innerHTML = "✨ UYUM SKORU: %100 ✨";
      options.innerHTML = `
        <div style="font-family: var(--font-serif); font-style: italic; font-size: 1.25rem; color: var(--retro-70s-amber); line-height: 1.6; padding: 10px;">
          "Evrenin gördüğü en uyumlu, en tatlı çifti! Ceren'in meraklı soruları ve Sabri'nin huzur veren sesiyle mükemmel bir eşleşme ❤️"
        </div>
      `;
      if (restartBtn) restartBtn.style.display = 'inline-flex';

      playChime(783.99, 'sine', 1.2);
      if (window.confetti) {
        window.confetti({ particleCount: 90, spread: 100, origin: { y: 0.6 } });
      }
    }
  }

  renderStep();

  if (restartBtn) {
    restartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentStep = 0;
      restartBtn.style.display = 'none';
      renderStep();
    });
  }
}

/* --------------------------------------------------------------------------
   7. RETRO PARTICLES (ROSE HEARTS & GOLDEN STARDUST)
   -------------------------------------------------------------------------- */
function initRetroParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 35;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 80;
      this.size = Math.random() * 10 + 5;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.4;
      this.opacity = Math.random() * 0.45 + 0.15;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.015;
      this.isHeart = Math.random() > 0.45;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.isHeart) {
        ctx.fillStyle = '#ea7396';
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
        ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = '#f9b233';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.22, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    p.y = Math.random() * height;
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   8. 70s AUDIO SYNTHESIZER
   -------------------------------------------------------------------------- */
let audioCtx = null;
let isAudioPlaying = false;
let ambientInterval = null;

function playChime(freq = 440, type = 'sine', duration = 0.8) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.log('Audio error:', e);
  }
}

function initRetroAudioSynthesizer() {
  const btn = document.getElementById('retro-audio-btn');
  const text = document.getElementById('audio-status-text');
  if (!btn) return;

  const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25];

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (isAudioPlaying) {
      isAudioPlaying = false;
      clearInterval(ambientInterval);
      btn.classList.remove('playing');
      text.textContent = '▶ 70\'s Melodi';
    } else {
      isAudioPlaying = true;
      audioCtx.resume();
      btn.classList.add('playing');
      text.textContent = '■ Çalıyor';

      let idx = 0;
      ambientInterval = setInterval(() => {
        const note = notes[idx % notes.length];
        playChime(note, 'sine', 1.8);
        idx++;
      }, 850);
    }
  });
}

/* --------------------------------------------------------------------------
   9. ACROSTIC POETRY (C-E-R-E-N)
   -------------------------------------------------------------------------- */
function initAcrosticPoetry() {
  const cards = document.querySelectorAll('.acrostic-card-70s');
  const notes = [329.63, 392.00, 440.00, 493.88, 587.33];

  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      playChime(notes[index % notes.length], 'sine', 1.2);

      if (window.confetti) {
        const rect = card.getBoundingClientRect();
        window.confetti({
          particleCount: 18,
          spread: 60,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight
          },
          colors: ['#ea7396', '#f9b233', '#f4c2cb']
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. 70s SWEETNESS SLIDER
   -------------------------------------------------------------------------- */
function initSweetnessSlider() {
  const slider = document.getElementById('sweetness-slider');
  const valDisplay = document.getElementById('sweetness-value');
  const statusDisplay = document.getElementById('sweetness-status');
  const confettiBtn = document.getElementById('confetti-btn');
  if (!slider) return;

  const statuses = [
    { threshold: 500, text: "Çok Tatlı! 🍬" },
    { threshold: 5000, text: "Gülüşüyle Güneşi Kıskandıran ✨" },
    { threshold: 50000, text: "Zamanı Durduran 7 Saatlik Sohbet Kraliçesi 👑" },
    { threshold: 500000, text: "Dünyanın En Şirin İnsanı ❤️" },
    { threshold: 1000000, text: "Evrendeki Tüm Yıldızlardan Daha Tatlı! 🌌✨" }
  ];

  slider.addEventListener('input', () => {
    const val = parseInt(slider.value);
    valDisplay.textContent = `%${val.toLocaleString('tr-TR')}`;

    let matchedStatus = statuses[0].text;
    for (let s of statuses) {
      if (val >= s.threshold) {
        matchedStatus = s.text;
      }
    }
    statusDisplay.textContent = matchedStatus;
  });

  confettiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playChime(783.99, 'sine', 1.0);
    if (window.confetti) {
      window.confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ea7396', '#f9b233', '#e76f51', '#ffd166']
      });
    }
  });
}

/* --------------------------------------------------------------------------
   11. 70s FORTUNE COOKIE
   -------------------------------------------------------------------------- */
function initFortuneCookie() {
  const btn = document.getElementById('fortune-cookie-btn');
  const newBtn = document.getElementById('new-fortune-btn');
  const message = document.getElementById('fortune-message');
  if (!btn) return;

  const compliments = [
    "7 saat sesli konuştuğumuz o ilk anlar hayatımın en tatlı saatleriydi ✨",
    "Sorduğun her soru kalbime dokunan en güzel 70'ler plağı gibi... 💕",
    "Senin benim için konfor alanından çıkman benim için paha biçilemez bir mutluluk!",
    "Zihninin derinliklerindeki fikirleri dinlemek hayatımdaki en güzel macera 🚀",
    "Gülüşün dünyanın tüm kahvelerinden daha enerjik ve tatlı! ☕",
    "Sürekli sorular sor ve ben saatlerce seni dinlemeye devam edeyim ❤️",
    "Instagram'da tanıştığımız o gün hayatımın en şanslı dönüm noktasıydı 🗓️"
  ];

  function crackCookie(e) {
    if (e) e.stopPropagation();
    playChime(587.33, 'triangle', 0.4);
    btn.style.transform = 'scale(1.3) rotate(20deg)';
    setTimeout(() => {
      btn.style.transform = 'scale(1) rotate(0deg)';
      const randomComp = compliments[Math.floor(Math.random() * compliments.length)];
      message.textContent = `"${randomComp}"`;

      if (window.confetti) {
        window.confetti({
          particleCount: 35,
          spread: 60,
          colors: ['#ea7396', '#f9b233']
        });
      }
    }, 200);
  }

  btn.addEventListener('click', crackCookie);
  if (newBtn) newBtn.addEventListener('click', crackCookie);
}

/* --------------------------------------------------------------------------
   12. 70s BUCKET LIST
   -------------------------------------------------------------------------- */
function initBucketList() {
  const items = document.querySelectorAll('.bucket-item-70s');

  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      item.classList.toggle('checked');
      const box = item.querySelector('.checkbox-70s');
      if (item.classList.contains('checked')) {
        box.textContent = '✓';
        playChime(659.25, 'sine', 0.35);
      } else {
        box.textContent = '';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   13. POLAROID LIGHTBOX
   -------------------------------------------------------------------------- */
function initPhotoLightbox() {
  const polaroid = document.getElementById('polaroid-photo');
  const lightbox = document.getElementById('lightbox-modal');
  if (!polaroid || !lightbox) return;

  polaroid.addEventListener('click', (e) => {
    e.stopPropagation();
    lightbox.classList.add('active');
    playChime(440, 'sine', 0.5);
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });
}

/* --------------------------------------------------------------------------
   14. WAX SEALED ENVELOPE MODAL
   -------------------------------------------------------------------------- */
function initEnvelopeModal() {
  const trigger = document.getElementById('envelope-trigger');
  const modal = document.getElementById('letter-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  if (!trigger || !modal) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    modal.classList.add('active');
    playChime(523.25, 'sine', 1.2);

    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#ea7396', '#f9b233', '#e76f51']
      });
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}
