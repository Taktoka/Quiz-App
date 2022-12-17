let currentIndex = 0;
let rightAnswers = 0;
let cDwnIntrv;
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let countSpan = document.querySelector(".q-count span");
let bultsContainer = document.querySelector(".bullets .spans");
let submit = document.querySelector(".submit");
let result = document.querySelector(".result");
let bulletsDiv = document.querySelector(".bullets");
let timer = document.querySelector(".timer");

function getQs() {
  let myReq = new XMLHttpRequest();
  myReq.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let qObject = JSON.parse(this.responseText);
      let qCount = qObject.length;

      addData(qObject[currentIndex], qCount);

      createBullets(qCount);

      countDown(5, qCount);

      submit.onclick = () => {
        let rightAnswer = qObject[currentIndex].right_answer;

        currentIndex++;

        checkAnaswer(rightAnswer, qCount);

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addData(qObject[currentIndex], qCount);

        handleBullets();

        clearInterval(cDwnIntrv);
        countDown(5, qCount);

        showResult(qCount);
      };
    }
  };

  myReq.open("GET", "html-questions.json", true);
  myReq.send();
}
getQs();

function addData(obj, count) {
  if (currentIndex < count) {
    let q = document.createElement("h2");
    let qtext = document.createTextNode(obj.title);
    q.appendChild(qtext);
    quizArea.appendChild(q);

    for (i = 1; i <= 4; i++) {
      let answerDiv = document.createElement("div");
      answerDiv.className = "answer";
      let radioInp = document.createElement("input");
      radioInp.type = "radio";
      radioInp.name = "answer";
      radioInp.id = `answer_${i}`;
      radioInp.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInp.checked = true;
      }

      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      let labelText = document.createTextNode(obj[`answer_${i}`]);
      label.appendChild(labelText);

      answerDiv.appendChild(radioInp);
      answerDiv.appendChild(label);

      answersArea.appendChild(answerDiv);
    }
  }
}

function createBullets(count) {
  countSpan.innerHTML = count;

  for (let i = 0; i < count; i++) {
    let bullet = document.createElement("span");

    if (i === 0) {
      bullet.className = "on";
    }

    bultsContainer.appendChild(bullet);
  }
}

function checkAnaswer(rAns, count) {
  let choosenAns;
  let allAnswers = document.getElementsByName("answer");
  let allAnswersArray = Array.from(allAnswers);
  for (let i = 0; i < allAnswersArray.length; i++) {
    if (allAnswersArray[i].checked) {
      choosenAns = allAnswersArray[i].dataset.answer;

      if (rAns === choosenAns) {
        rightAnswers++;
      }
    }
  }
}

function handleBullets() {
  let bullets = document.querySelectorAll(".bullets .spans span");
  let bulletsArray = Array.from(bullets);
  bulletsArray.forEach((bullet, index) => {
    if (currentIndex === index) {
      bullet.className = "on";
    }
  });
}

function showResult(count) {
  let theResult;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submit.remove();
    bulletsDiv.remove();
    result.style.display = "block";

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResult = `<span class="good">Good</span> You answered ${rightAnswers} from ${count}`;
    } else if (rightAnswers === count) {
      theResult = `<span class="perfect">Perfect</span> You answered ${rightAnswers} from ${count}`;
    } else {
      theResult = `<span class="bad">Bad</span> You answered ${rightAnswers} from ${count}`;
    }

    result.innerHTML = theResult;
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    cDwnIntrv = setInterval(() => {
      let minutes = parseInt(duration / 60);
      let seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      timer.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(cDwnIntrv);
        submit.click();
      }
    }, 1000);
  }
}
