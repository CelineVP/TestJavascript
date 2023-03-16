/* Selectionner les éléments dans html */
const player = document.querySelector('.player'); // élément principal
const video = player.querySelector('.viewer'); // vidéo à lire
const progress = player.querySelector('.progress'); // barre de progression de la vidéo
const progressBar = player.querySelector('.progress__filled'); // barre de remplissage de la barre de progression
const toggle = player.querySelector('.toggle'); // mettre en pause ou play la vidéo
const skipButtons = player.querySelectorAll('[data-skip]'); // passer en avant ou en arrière de la vidéo
const ranges = player.querySelectorAll('.player__slider'); // régler le volume et la vitesse de la vidéo

/* Build out functions */
function togglePlay() { // lorsque click play/pause selon l'état de la vidéo
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}

function updateButton() { // modification des buttons selon play/pause
  const icon = this.paused ? '►' : '❚ ❚';
  console.log(icon);
  toggle.textContent = icon;
}

function skip() { // avancer ou reculer la vidéo
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value; // = playbackRate ou volume
}

function handleProgress() { // placement sur  la barre de progression (remplissage)
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) { // coordonnées pour la vitesse
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

/* Hook up the event listeners */ // appelle les foncitoin en fonction du click
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
