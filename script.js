let questions = []; // No hardcoded questions

let currentQuestionIndex = 0;
let score = 0;

const questionEl = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const nextBtn = document.getElementById('next-btn');

// Example API call – Replace with your actual API endpoint
async function fetchQuestions() {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=5&type=multiple'); // Example API
    const data = await response.json();

    // Transform API data to fit your format
    questions = data.results.map(item => {
      const allAnswers = [...item.incorrect_answers];
      const correctIndex = Math.floor(Math.random() * (allAnswers.length + 1));
      allAnswers.splice(correctIndex, 0, item.correct_answer);

      return {
        question: decodeHTML(item.question),
        answers: allAnswers.map(decodeHTML),
        correct: decodeHTML(item.correct_answer)
      };
    });

    showQuestion();
  } catch (error) {
    questionEl.innerText = 'Failed to load questions.';
    console.error(error);
  }
}

// Helper to decode HTML entities in API responses
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function showQuestion() {
  resetState();
  const current = questions[currentQuestionIndex];
  questionEl.innerText = current.question;

  current.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer;
    button.classList.add('btn');
    button.addEventListener('click', () => selectAnswer(button, current.correct));
    answerButtons.appendChild(button);
  });
}

function resetState() {
  nextBtn.style.display = 'none';
  answerButtons.innerHTML = '';
}

function selectAnswer(button, correctAnswer) {
  const selected = button.innerText;
  if (selected === correctAnswer) {
    button.style.background = 'lightgreen';
    score++;
  } else {
    button.style.background = 'indianred';
  }
  Array.from(answerButtons.children).forEach(btn => btn.disabled = true);
  nextBtn.style.display = 'block';
}

nextBtn.addEventListener('click', () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    if (nextBtn.innerText === 'Restart') {
      currentQuestionIndex = 0;
      score = 0;
      nextBtn.innerText = 'Next';
      fetchQuestions();
    } else {
      showScore();
    }
  }
});

function showScore() {
  resetState();
  questionEl.innerText = `Quiz finished! Your score: ${score} / ${questions.length}`;
  nextBtn.innerText = 'Restart';
  nextBtn.style.display = 'block';
}

// Start by fetching questions
fetchQuestions();
