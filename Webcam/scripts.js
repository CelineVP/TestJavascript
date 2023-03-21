const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d'); // contient le rendu en 2D de canvas
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() { // permet d'accéder à la camera et capturer video en temps réel
  navigator.mediaDevices.getUserMedia({ video: true, audio: false }) // demande autorisation à user
    .then(localMediaStream => { // représente le flux de données de la vidéo
      console.log(localMediaStream);
      video.srcObject = localMediaStream; // source de la vidéo
      video.play(); // démarrer la vidéo
    })
    .catch(err => { // si error alors message
      console.error(`OH NO!!!`, err);
    });
}

function paintToCanvas() { // prend la vidéo et l'affiche dans le canvas html
  const width = video.videoWidth; // largeur vidéo
  const height = video.videoHeight; // hauteur vidéo
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => { // fn de traitement de la vidéo
    ctx.drawImage(video, 0, 0, width, height); // représente vidéo sur canvas
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height); // récupère les images de la vidéo en pixels
    // mess with them
    // pixels = redEffect(pixels);

    pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.8;

    // pixels = greenScreen(pixels);
    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // played the sound
  snap.currentTime = 0;
  snap.play(); // jouer le son sanp

  // take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg'); // otenir l'image sous forme de données
  const link = document.createElement('a'); // crée un lien de téléchargement
  link.href = data;
  link.setAttribute('download', 'handsome'); // ajoute download au lien de téléchargement (a)
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`; // afficher l'image qui vient d'être capturer
  strip.insertBefore(link, strip.firstChild); // insert élément capturer dans strip pour afficher dans gallerie
}

function redEffect(pixels) { // effet sur vidéo rouge
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) { // effet sur vidéo
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) { // effet vidéo
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
