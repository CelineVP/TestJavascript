let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // check if we should stop it!
    if(secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    // display it
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) { // temps en seconds
  const minutes = Math.floor(seconds / 60); // arrondir minutes en seconds
  const remainderSeconds = seconds % 60; // récupère le reste des seconds
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`; // affiche les min et le restes des seconds
  document.title = display;
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) { // affiche le temps par rapport à l'heure en cours
  const end = new Date(timestamp);
  const hour = end.getHours();
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  const minutes = end.getMinutes();
  endTime.textContent = `Be Back At ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`; // affiche l'heure de retour
}

function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));

document.customForm.addEventListener('submit', function(e) { // entrez un timer et le transmet à timer
  e.preventDefault();
  const mins = this.minutes.value;
  console.log(mins);
  timer(mins * 60);
  this.reset();
});
