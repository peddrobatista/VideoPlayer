const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
videoTimeLine = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".progress-bar"),
volumeBtn = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".left input"),
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
playPauseBtn = container.querySelector(".play-pause i"),
speedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options"),
picInPicBtn = container.querySelector(".pic-in-pic span"),
fullScreenBtn = container.querySelector(".fullscreen i");
let timer;
const hideControls = () => {
    if (mainVideo.paused) return; // retorne se o vídeo está pausado
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 3000);
}
hideControls();

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls"); // adiciona a classe show-controls no mousemove
    clearTimeout(timer); // Limpa o timer 
    hideControls(); // Chamando a função hideControls
});

const formatTime = time => {
    // Pega segundos, minutos e horas
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    // adicionando 0 no início se o valor específico for menor que 10
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if (hours == 0) { // Se a hora for 0 retorne apenas minutos e segundos senão retorne tudo
        return `${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
}

mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target; // Pega o tempo atual e a duração do vídeo
    let percent = (currentTime / duration) * 100; // Pega a porcentagem
    progressBar.style.width = `${percent}%`; // Passando a porcentagem na largura da barra de progresso (progress-bar)
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", e => {
    videoDuration.innerText = formatTime(e.target.duration); // passando a duração do vídeo como VideoDuration innerText
});

videoTimeLine.addEventListener("click", e => {
    let timelineWidth = videoTimeLine.clientWidth; // pega a largura do videoTimeLine 
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // atualizando o tempo de vídeo atual
});

const draggableProgressBar = e => {
    let timelineWidth = videoTimeLine.clientWidth; // pega a largura do videoTimeLine 
    progressBar.style.width = `${e.offsetX}px`; // passando o valor offsetX como largura da progressbar
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // atualizando o tempo de vídeo atual
    currentVidTime.innerText = formatTime(mainVideo.currentTime); // passando o tempo atual de vídeo como currentVidTime innerText
}

videoTimeLine.addEventListener("mousedown", () => { // Chamando a função draggableProgressBar no evento mousemove
    videoTimeLine.addEventListener("mousemove", draggableProgressBar);
});

container.addEventListener("mouseup", () => { // removendo o ouvinte mousemove no evento mouseup
    videoTimeLine.removeEventListener("mousemove", draggableProgressBar);
});

videoTimeLine.addEventListener("mousemove", e => {
    const progressTime = videoTimeLine.querySelector("span");
    let offsetX = e.offsetX; // pegando a posição X do mouse
    progressTime.style.left = `${offsetX}px`; // passando o valor offsetX como progressTime valor esquerdo
    let timelineWidth = videoTimeLine.clientWidth;
    let percent = (e.offsetX / timelineWidth) * mainVideo.duration; // pegando a porcentagem
    progressTime.innerText = formatTime(percent); // passando a porcentagem como progressTime innerText
});
volumeBtn.addEventListener("click", () => {
    if(!volumeBtn.classList.contains("fa-volume-high")) { // se o ícone de volume não for o ícone de volume alto
        mainVideo.volume = 0.5; // passando o valor 0.5 como volume de vídeo
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    } else {
        mainVideo.volume = 0.0; // passando o valor 0.0 como volume de vídeo, então mutar o vídeo
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
});

volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value; // Passado o slider value como volume do vídeo
    if (e.target.value == 0) { // se slider value for 0, mude o ícone para mudo
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    } else {
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    }
});

speedBtn.addEventListener("click", () => {
    speedOptions.classList.toggle("show"); // alterna as classes
});

speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => { // adicionando evento de clique em todas as opções de velocidade
        mainVideo.playbackRate = option.dataset.speed; // passando o valor do conjunto de dados da opção como valor de reprodução de vídeo
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active"); // Adiciona a classe active na opção selecionada
    });
});

document.addEventListener("click", e => { // ocultar opções de velocidade ao clicar no documento
    if (e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded") {
        speedOptions.classList.remove("show");
    }
});

picInPicBtn.addEventListener("click", () => {
    mainVideo.requestPictureInPicture(); // Munda o modo de vídeo para picture in picture
});

fullScreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen");
    if (document.fullscreenElement) { // Se o vídeo já está no modo tela cheia
        fullScreenBtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen();
    }
    fullScreenBtn.classList.replace("fa-expand", "fa-compress");
    container.requestFullscreen(); // Vai para o modo tela cheia
});

skipBackward.addEventListener("click", () => {
    mainVideo.currentTime -= 5; // subtrai 5 segundos do tempo atual do vídeo
});

skipForward.addEventListener("click", () => {
    mainVideo.currentTime += 5; // adiciona 5 segundos para o tempo atual do vídeo
});

playPauseBtn.addEventListener("click", () => {
    // Se o vídeo está pausado? play no vídeo senão pause o vídeo
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});
//Mudando os ícones de play e pause ao clicar em um deles
mainVideo.addEventListener("play", () => { // se o vídeo está play, mude o ícone para pause
    playPauseBtn.classList.replace("fa-play", "fa-pause");
});
mainVideo.addEventListener("pause", () => { // se o vídeo está pausado, mude o ícone para play
    playPauseBtn.classList.replace("fa-pause", "fa-play");
});
