const CONFIG = {
  totalQuestions : 20,
  durationMinutes: 30,
  passingScore   : 85,
  storageKey     : "examSession",
  historyKey     : "examHistory"
};

let state = {
  studentName  : "",
  currentIndex : 0,
  answers      : {},
  timerInterval: null,
  secondsLeft  : CONFIG.durationMinutes * 60,
  examStarted  : false,
  examEnded    : false,
  lastResult   : null
};

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.getElementById(pageId);
  if (page) { page.classList.add("active"); window.scrollTo(0, 0); }
  if (pageId === "page-history") renderHistory();
}

function confirmStart() {
  const input   = document.getElementById("studentName");
  const errorEl = document.getElementById("nameError");
  const name    = input.value.trim();
  if (!name) {
    errorEl.classList.add("show");
    input.focus();
    return;
  }
  errorEl.classList.remove("show");
  document.getElementById("modalStart").classList.remove("hidden");
}

function closeModalStart() {
  document.getElementById("modalStart").classList.add("hidden");
}

function startExam() {
  document.getElementById("modalStart").classList.add("hidden");
  const name = document.getElementById("studentName").value.trim();

  state.studentName  = name;
  state.currentIndex = 0;
  state.answers      = {};
  state.secondsLeft  = CONFIG.durationMinutes * 60;
  state.examStarted  = true;
  state.examEnded    = false;
  state.lastResult   = null;

  saveSession();
  document.getElementById("examNameBadge").textContent = name;
  buildNavGrid();
  renderQuestion();
  updateProgress();
  startTimer();
  showPage("page-exam");
}

function renderQuestion() {
  const q      = questions[state.currentIndex];
  const isLast = state.currentIndex === CONFIG.totalQuestions - 1;

  document.getElementById("questionNumber").textContent =
    "Soal " + (state.currentIndex + 1) + " dari " + CONFIG.totalQuestions;
  document.getElementById("questionText").innerHTML = q.question;
  document.getElementById("questionCounter").textContent =
    (state.currentIndex + 1) + " / " + CONFIG.totalQuestions;

  const optsList = document.getElementById("optionsList");
  optsList.innerHTML = "";
  ["A","B","C","D","E"].forEach(letter => {
    const isSelected = state.answers[state.currentIndex] === letter;
    const item = document.createElement("div");
    item.className = "option-item" + (isSelected ? " selected" : "");
    item.onclick = () => selectAnswer(letter);

    const letterSpan = document.createElement("span");
    letterSpan.className = "option-letter";
    letterSpan.textContent = letter;

    const textSpan = document.createElement("span");
    textSpan.className = "option-text";
    textSpan.textContent = q.options[letter];

    item.appendChild(letterSpan);
    item.appendChild(textSpan);
    optsList.appendChild(item);
  });

  document.getElementById("btnPrev").disabled = state.currentIndex === 0;

  const btnNext = document.getElementById("btnNext");
  if (isLast) {
    btnNext.textContent = "Akhiri Ujian ✓";
    btnNext.className   = "btn btn-danger btn-sm";
    btnNext.onclick     = confirmEnd;
  } else {
    btnNext.textContent = "Berikutnya →";
    btnNext.className   = "btn btn-primary btn-sm";
    btnNext.onclick     = nextQuestion;
  }

  updateNavGrid();
  const card = document.getElementById("questionCard");
  card.style.animation = "none";
  card.offsetHeight;
  card.style.animation = "";
}

function selectAnswer(letter) {
  if (state.examEnded) return;
  state.answers[state.currentIndex] = letter;
  saveSession();
  renderQuestion();
  updateProgress();
}

function nextQuestion() {
  if (state.currentIndex < CONFIG.totalQuestions - 1) {
    state.currentIndex++;
    renderQuestion();
  }
}

function prevQuestion() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    renderQuestion();
  }
}

function goToQuestion(index) {
  state.currentIndex = index;
  renderQuestion();
}

function buildNavGrid() {
  const grid = document.getElementById("questionNavGrid");
  grid.innerHTML = "";
  for (let i = 0; i < CONFIG.totalQuestions; i++) {
    const btn = document.createElement("button");
    btn.className   = "nav-btn";
    btn.textContent = i + 1;
    btn.onclick     = () => goToQuestion(i);
    grid.appendChild(btn);
  }
}

function updateNavGrid() {
  const btns = document.querySelectorAll("#questionNavGrid .nav-btn");
  btns.forEach((btn, i) => {
    btn.classList.remove("current", "answered");
    if (i === state.currentIndex)            btn.classList.add("current");
    else if (state.answers[i] !== undefined) btn.classList.add("answered");
  });
}

function updateProgress() {
  const count = Object.keys(state.answers).length;
  document.getElementById("progressFill").style.width =
    (count / CONFIG.totalQuestions * 100) + "%";
  document.getElementById("progressLabel").textContent =
    count + " / " + CONFIG.totalQuestions + " terjawab";
}

function startTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.secondsLeft--;
    updateTimerDisplay();
    saveSession();
    if (state.secondsLeft <= 0) {
      clearInterval(state.timerInterval);
      timeUp();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m  = Math.floor(state.secondsLeft / 60);
  const s  = state.secondsLeft % 60;
  const el = document.getElementById("timerDisplay");
  el.textContent = String(m).padStart(2,"0") + ":" + String(s).padStart(2,"0");
  el.classList.remove("warning","danger");
  if      (state.secondsLeft <= 60)  el.classList.add("danger");
  else if (state.secondsLeft <= 300) el.classList.add("warning");
}

function timeUp() {
  document.getElementById("timeupOverlay").classList.remove("hidden");
}

function confirmEnd() {
  const unanswered = [];
  for (let i = 0; i < CONFIG.totalQuestions; i++) {
    if (state.answers[i] === undefined) unanswered.push(i + 1);
  }
  if (unanswered.length > 0) {
    showUnansweredModal(unanswered);
  } else {
    document.getElementById("modalOverlay").classList.remove("hidden");
  }
}

function showUnansweredModal(unanswered) {
  const listEl = document.getElementById("unansweredList");
  listEl.innerHTML = unanswered.map(n =>
    '<span class="unanswered-chip">' + n + '</span>'
  ).join("");
  document.getElementById("unansweredOverlay").classList.remove("hidden");
}

function closeUnansweredModal() {
  document.getElementById("unansweredOverlay").classList.add("hidden");
}

function forceEnd() {
  document.getElementById("unansweredOverlay").classList.add("hidden");
  endExam();
}

function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
}

function endExam() {
  document.getElementById("modalOverlay").classList.add("hidden");
  document.getElementById("timeupOverlay").classList.add("hidden");
  document.getElementById("unansweredOverlay").classList.add("hidden");

  if (state.timerInterval) clearInterval(state.timerInterval);
  state.examEnded = true;

  const result     = calculateResult();
  state.lastResult = result;
  saveHistory(result);
  localStorage.removeItem(CONFIG.storageKey);
  showResult(result);
}

function calculateResult() {
  let correct = 0, wrong = 0, empty = 0;
  questions.forEach((q, i) => {
    const ans = state.answers[i];
    if (!ans)                  empty++;
    else if (ans === q.answer) correct++;
    else                       wrong++;
  });
  const score  = Math.round((correct / CONFIG.totalQuestions) * 100);
  const passed = score >= CONFIG.passingScore;
  return {
    name   : state.studentName,
    correct, wrong, empty,
    score, percent: score, passed,
    answers: Object.assign({}, state.answers),
    date   : new Date().toLocaleString("id-ID")
  };
}

function showResult(result) {
  document.getElementById("resultName").textContent   = result.name;
  document.getElementById("scoreNumber").textContent  = result.score;
  document.getElementById("scorePercent").textContent = result.percent + "%";
  document.getElementById("statCorrect").textContent  = result.correct;
  document.getElementById("statWrong").textContent    = result.wrong;
  document.getElementById("statEmpty").textContent    = result.empty;

  const badge  = document.getElementById("resultStatusBadge");
  const icon   = document.getElementById("resultIcon");
  const reason = document.getElementById("resultReason");

  if (result.passed) {
    badge.textContent  = "Lulus";
    badge.className    = "result-status-badge lulus";
    icon.textContent   = "🏆";
    reason.textContent = "Selamat! Nilai kamu " + result.score + " sudah memenuhi KKM (" + CONFIG.passingScore + ").";
    reason.className   = "result-reason reason-lulus";
  } else {
    badge.textContent  = "Belum Lulus";
    badge.className    = "result-status-badge belum";
    icon.textContent   = "📝";
    reason.textContent = "Nilai kamu " + result.score + " belum memenuhi KKM (" + CONFIG.passingScore + "). Tetap semangat!";
    reason.className   = "result-reason reason-belum";
  }

  showPage("page-result");

  setTimeout(() => {
    const circle = document.getElementById("scoreProgressCircle");
    circle.style.strokeDashoffset = 326.7 - (result.percent / 100) * 326.7;
    circle.style.stroke = result.passed ? "#22875a" : "#e8748a";
  }, 200);
}

function buildReviewHTML(savedAnswers) {
  let html = "";
  questions.forEach((q, i) => {
    const userAnswer = savedAnswers[i];
    const isCorrect  = userAnswer === q.answer;
    const isEmpty    = !userAnswer;

    let itemClass, statusLabel;
    if (isEmpty)        { itemClass = "review-item review-empty";   statusLabel = "Tidak Dijawab"; }
    else if (isCorrect) { itemClass = "review-item review-correct"; statusLabel = "Benar ✓"; }
    else                { itemClass = "review-item review-wrong";   statusLabel = "Salah ✗"; }

    let answerHtml = "";
    if (!isEmpty) {
      answerHtml += '<span class="review-answer-chip chip-user">Jawaban kamu: ' +
        userAnswer + '. ' + q.options[userAnswer] + '</span>';
    } else {
      answerHtml += '<span class="review-answer-chip chip-empty">Tidak dijawab</span>';
    }
    if (!isEmpty && !isCorrect) {
      answerHtml += '<span class="review-answer-chip chip-wrong-note">✗ Jawaban kamu salah</span>';
    }

    html +=
      '<div class="' + itemClass + '">' +
        '<div class="review-item-header">' +
          '<span class="review-num">Soal ' + (i + 1) + ' — ' + statusLabel + '</span>' +
        '</div>' +
        '<div class="review-q-text">' + q.question + '</div>' +
        '<div class="review-answer-row">' + answerHtml + '</div>' +
      '</div>';
  });
  return html;
}

function showReview() {
  const answers = state.lastResult ? state.lastResult.answers : state.answers;
  document.getElementById("reviewList").innerHTML = buildReviewHTML(answers);
  document.getElementById("reviewBackBtn").onclick = () => showPage("page-result");
  showPage("page-review");
}

function showReviewFromHistory(answersJSON) {
  const savedAnswers = JSON.parse(answersJSON);
  document.getElementById("reviewList").innerHTML = buildReviewHTML(savedAnswers);
  document.getElementById("reviewBackBtn").onclick = () => showPage("page-history");
  showPage("page-review");
}

function saveHistory(result) {
  let history = getHistory();
  history.unshift({
    name   : result.name,
    date   : result.date,
    score  : result.score,
    correct: result.correct,
    wrong  : result.wrong,
    empty  : result.empty,
    passed : result.passed,
    answers: result.answers
  });
  if (history.length > 50) history = history.slice(0, 50);
  localStorage.setItem(CONFIG.historyKey, JSON.stringify(history));
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem(CONFIG.historyKey)) || []; }
  catch { return []; }
}

function renderHistory() {
  const list    = document.getElementById("historyList");
  const history = getHistory();
  list.innerHTML = "";

  if (history.length === 0) {
    list.innerHTML =
      '<div class="history-empty">' +
        '<div class="empty-icon">📭</div>' +
        '<p>Belum ada riwayat ujian</p>' +
      '</div>';
    return;
  }

  history.forEach((item, idx) => {
    const answersEncoded = encodeURIComponent(JSON.stringify(item.answers || {}));
    const el = document.createElement("div");
    el.className = "history-item";
    el.style.animationDelay = (idx * 0.05) + "s";
    el.innerHTML =
      '<div class="history-left">' +
        '<div class="history-name">' + item.name + '</div>' +
        '<div class="history-date">📅 ' + item.date + '</div>' +
        '<div class="history-meta">' +
          '<span>✅ ' + item.correct + ' benar</span>' +
          '<span>❌ ' + item.wrong + ' salah</span>' +
          '<span>⬜ ' + item.empty + ' kosong</span>' +
        '</div>' +
      '</div>' +
      '<div class="history-right">' +
        '<div class="history-score">' + item.score + '</div>' +
        '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">' +
          '<span class="history-badge ' + (item.passed ? "badge-lulus" : "badge-belum") + '">' +
            (item.passed ? "Lulus" : "Belum Lulus") +
          '</span>' +
          (item.answers
            ? '<button class="btn btn-secondary btn-sm" onclick="showReviewFromHistory(decodeURIComponent(\'' + answersEncoded + '\'))">Review</button>'
            : '') +
        '</div>' +
      '</div>';
    list.appendChild(el);
  });
}

function clearHistory() {
  if (confirm("Hapus semua riwayat ujian?")) {
    localStorage.removeItem(CONFIG.historyKey);
    renderHistory();
  }
}

function saveSession() {
  localStorage.setItem(CONFIG.storageKey, JSON.stringify({
    studentName : state.studentName,
    currentIndex: state.currentIndex,
    answers     : state.answers,
    secondsLeft : state.secondsLeft
  }));
}

function restoreSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG.storageKey));
    if (!saved || !saved.studentName) return false;
    const resume = confirm(
      'Ada sesi ujian yang belum selesai untuk "' + saved.studentName + '".\n' +
      'Sisa waktu: ' + Math.floor(saved.secondsLeft / 60) + ' menit ' + (saved.secondsLeft % 60) + ' detik.\n\n' +
      'Lanjutkan ujian?'
    );
    if (!resume) { localStorage.removeItem(CONFIG.storageKey); return false; }

    state.studentName  = saved.studentName;
    state.currentIndex = saved.currentIndex || 0;
    state.answers      = saved.answers || {};
    state.secondsLeft  = saved.secondsLeft || CONFIG.durationMinutes * 60;
    state.examStarted  = true;
    state.examEnded    = false;

    document.getElementById("examNameBadge").textContent = state.studentName;
    buildNavGrid();
    renderQuestion();
    updateProgress();
    startTimer();
    showPage("page-exam");
    return true;
  } catch { return false; }
}

document.addEventListener("DOMContentLoaded", () => {
  const restored = restoreSession();
  if (!restored) showPage("page-landing");

  document.getElementById("studentName").addEventListener("input", () => {
    document.getElementById("nameError").classList.remove("show");
  });
  document.getElementById("studentName").addEventListener("keydown", e => {
    if (e.key === "Enter") confirmStart();
  });
});
