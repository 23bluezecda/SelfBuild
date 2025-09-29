function playNewAudio(fileName) {
    let audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.getElementsByClassName('a_ogg')[0].src = fileName+".ogg";
    audioPlayer.getElementsByClassName('a_mp3')[0].src = fileName+".mp3";
    audioPlayer.load();
    audioPlayer.play();
}

function playSFX(fileName) {
    let audioPlayer = document.getElementById('sfxPlayer');
    audioPlayer.getElementsByClassName('sfx_ogg')[0].src = fileName+".ogg";
    audioPlayer.load();
    audioPlayer.play();
}
