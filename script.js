
const questions = [
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    answer: 1
  },
  {
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    answer: 2
  },
  {
    question: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Hydrogen", "Carbon dioxide"],
    answer: 3
  },
  {
    question: "Who wrote the Indian national anthem, Jana Gana Mana?",
    options: [
      "Bankim Chandra Chatterjee",
      "Rabindranath Tagore",
      "Sarojini Naidu",
      "Subramania Bharati"
    ],
    answer: 1
  },
  {
    question: "What is the largest ocean on Earth?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean"
    ],
    answer: 3
  },
  {
    question: "Which organ in the human body primarily filters blood to produce urine?",
    options: ["Heart", "Lungs", "Kidneys", "Stomach"],
    answer: 2
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Ag", "Au", "Gd", "Go"],
    answer: 1
  },
  {
    question: "In which year did India gain independence?",
    options: ["1945", "1947", "1950", "1952"],
    answer: 1
  },
  {
    question: "Which is the hardest naturally occurring substance?",
    options: ["Quartz", "Iron", "Diamond", "Granite"],
    answer: 2
  },
  {
    question: "How many players from one team are on the field in a standard football (soccer) match?",
    options: ["9", "10", "11", "12"],
    answer: 2
  }
];

let currentQuestion = 0;
let userAnswers = Array(questions.length).fill(null);
let timeLeft = 10 * 60;
let timerInterval = null;
let quizFinished = false;

const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionCount = document.getElementById("question-count");
const timerDisplay = document.getElementById("timer");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const feedbackElement = document.getElementById("feedback");
const progressBar = document.getElementById("progress-bar");
const previousButton = document.getElementById("previous-btn");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");

function showQuestion() {
  const question = questions[currentQuestion];

  questionCount.textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  questionElement.textContent = question.question;

  progressBar.style.width =
    `${((currentQuestion + 1) / questions.length) * 100}%`;

  optionsElement.innerHTML = "";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";

    if (userAnswers[currentQuestion] === index) {
      button.classList.add("selected");
    }

    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = String.fromCharCode(65 + index);

    const text = document.createElement("span");
    text.textContent = option;

    button.append(letter, text);

    button.addEventListener("click", () => {
      if (quizFinished) return;

      userAnswers[currentQuestion] = index;
      showQuestion();
    });

    optionsElement.appendChild(button);
  });

  feedbackElement.textContent =
    userAnswers[currentQuestion] === null
      ? "Choose one answer to continue."
      : "Answer selected. You can change it before finishing.";

  previousButton.disabled = currentQuestion === 0;

  nextButton.textContent =
    currentQuestion === questions.length - 1
      ? "Finish Quiz"
      : "Next";
}

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  timerDisplay.parentElement.classList.toggle(
    "warning",
    timeLeft <= 60
  );

  if (timeLeft <= 0) {
    finishQuiz();
    return;
  }

  timeLeft--;
}

function startTimer() {
  clearInterval(timerInterval);
  updateTimer();

  timerInterval = setInterval(updateTimer, 1000);
}

function finishQuiz() {
  if (quizFinished) return;

  quizFinished = true;
  clearInterval(timerInterval);

  const score = questions.reduce((total, question, index) => {
    return total + (userAnswers[index] === question.answer ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);

  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  document.getElementById("final-score").textContent =
    `${score} / ${questions.length}`;

  document.getElementById("percentage").textContent =
    `${percentage}%`;

  document.getElementById("result-progress").style.width =
    `${percentage}%`;

  let title;
  let message;

  if (percentage >= 80) {
    title = "Excellent Work!";
    message = "Outstanding performance. You have a strong general knowledge base.";
  } else if (percentage >= 50) {
    title = "Good Effort!";
    message = "Nice work! Keep learning and challenge yourself again.";
  } else {
    title = "Keep Practising!";
    message = "Every attempt helps you learn. Try again to improve your score.";
  }

  if (timeLeft <= 0) {
    message += " Time ran out, so the quiz was submitted automatically.";
  }

  document.getElementById("result-title").textContent = title;
  document.getElementById("result-message").textContent = message;
}

previousButton.addEventListener("click", () => {
  if (currentQuestion > 0 && !quizFinished) {
    currentQuestion--;
    showQuestion();
  }
});

nextButton.addEventListener("click", () => {
  if (quizFinished) return;

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    finishQuiz();
  }
});

restartButton.addEventListener("click", () => {
  currentQuestion = 0;
  userAnswers = Array(questions.length).fill(null);
  timeLeft = 10 * 60;
  quizFinished = false;

  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  startTimer();
  showQuestion();
});

showQuestion();
startTimer();
