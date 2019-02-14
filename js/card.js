const cards = document.querySelector('.cards');
const score = document.querySelector('.score');
const start = document.querySelector('.start');
const time = document.querySelector('.time');
const dim = document.querySelector('.dim');
const result = document.querySelector('.result');
const resultOkay = document.querySelector('.result_ok');
const resultTitle = document.querySelector('.result_title');
const resultScore = document.querySelector('.result_score');
let cardNum;
let cardRecord = [];
let frontCard;
let backCard;
let cardNumRecord = [];
let checkingCard = true;
let correct = 0;
let seconds = 60;
let gameOver = false;

// 이미지 랜덤 배열
function randomImage(array) {
  let currentIndex = array.length;
  let tempoValue;
  let randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    tempoValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = tempoValue;
  }

  return array;
}

// 카드 생성
function createCardList(array) {
  let randomArray = randomImage(array);
  const cardList = randomArray.map((image, i) => `
  <div class="card" data-id="card${i+1}">
    <div class="back">
      <img src="./images/${image}"/>
    </div>
    <div class="front">?</div>
  </div>
  `).join("");

  return cardList;
}

// 카드 DOM에 넣기
function insertCardList() {
  const list = createCardList(images);
  cards.innerHTML = list;
}

// 카드 클릭했을때
function clickCard() {
  const card = document.querySelectorAll('.card');

  card.forEach(card => card.addEventListener('click', function(e) {
    if(checkingCard && cardRecord.length <= 2 && !e.target.parentElement.classList.contains('fliped') && gameOver == false)  {
      cardNum = e.target.parentElement.dataset.id;
      frontCard = document.querySelector(`[data-id=${cardNum}]`).querySelector('.front');
      backCard = document.querySelector(`[data-id=${cardNum}]`).querySelector('.back');
      frontCard.classList.add('fliped');
      backCard.classList.add('fliped');

      cardRecord.push(backCard.querySelector('img').src);
      cardNumRecord.push(cardNum);

      // 카드 2장 오픈했을때
      if(cardRecord.length === 2) {
        // 카드가 같을 경우
        if(cardRecord[0] === cardRecord[1]) {
          correct++;
          score.innerHTML = `Score : ${correct}`;
          cardRecord = [];
          cardNumRecord = [];

          if(correct == images.length / 2) {
            setTimeout(() => {
              displayResult();
            }, 400);
            return;
          }
        // 카드가 같지 않을 경우
        } else {
          checkingCard = false;
          // 카드 돌리기
          setTimeout(flipBack, 600);
        }
      } 
    }

    if(gameOver == true) {
      alert("게임이 끝났습니다. 다시 하시려면 게임 시작 버튼을 눌러주세요.");
    }
  }))
}

// 카드 돌리기 복구
function flipBack() {
  frontCard = document.querySelector(`[data-id=${cardNumRecord[0]}]`).querySelector('.front');  
  backCard = document.querySelector(`[data-id=${cardNumRecord[0]}]`).querySelector('.back');
  frontCard.classList.remove('fliped');
  backCard.classList.remove('fliped');
  frontCard = document.querySelector(`[data-id=${cardNumRecord[1]}]`).querySelector('.front');
  backCard = document.querySelector(`[data-id=${cardNumRecord[1]}]`).querySelector('.back');
  frontCard.classList.remove('fliped');
  backCard.classList.remove('fliped');

  cardRecord = [];
  cardNumRecord = [];
  checkingCard = true;
}

// 게임 시작 버튼
function clickStart() {
  window.location.reload();
}
start.addEventListener('click', clickStart);

// 시간
function timer(seconds) {
  time.innerHTML = seconds < 10 ? "0"+seconds : seconds;
  if(seconds === 0) {
    clearTimeout(startTimer);
    time.innerHTML = "00";
    displayResult();
    return;
  }
  seconds--;
  startTimer = setTimeout(function() {
    timer(seconds);
  }, 1000);
}

// 결과
function displayResult() {
  gameOver = true;
  
  dim.style.display = "block";
  result.style.display = "block";

  if(correct == images.length / 2) {
    resultTitle.innerHTML = "성공! 축하합니다."
    resultScore.innerHTML = `당신의 점수는 ${correct} 입니다`;
  } else {
    resultTitle.innerHTML = "실패! 다시 도전하세요."
    resultScore.innerHTML = `당신의 점수는 ${correct} 입니다`;
  }

  clearTimeout(startTimer);
}

// 오케 클릭!
function clickOkay() {
  dim.style.display = "none";
  result.style.display = "none";
}

resultOkay.addEventListener('click', clickOkay);

// 초기화
function init() {
  insertCardList();
  clickCard();
  timer(seconds);
}

init();