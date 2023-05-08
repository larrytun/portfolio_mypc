$(document).ready(function() {
  const songs = [{
      number: "01",
      title: "Seven Nation Army",
      src: "music/SevenNationArmy.mp3",
      album: "Elephant",
      artist: "The White Stripes",
      albumArt: "img/whitestripes.jpg"
    },
    {
      number: "02",
      title: "What I Got",
      src: "music/WhatIGot.mp3",
      album: "Sublime",
      artist: "Sublime",
      albumArt: "img/sublime.jpg"
    },
    {
      number: "03",
      title: "My Own Worst Enemy",
      src: "music/MyOwnWorstEnemy.mp3",
      album: "A Place in the Sun",
      artist: "Lit",
      albumArt: "img/lit.jpg"
    },
    {
      number: "04",
      title: "Ms. Jackson",
      src: "music/MsJackson.mp3",
      album: "Stankonia",
      artist: "OutKast",
      albumArt: "img/outkast.jpg"
    },
    {
      number: "05",
      title: "Around The World",
      src: "music/AroundTheWorld.mp3",
      album: "Homework",
      artist: "Daft Punk",
      albumArt: "img/daftpunk.jpg"
    },
    {
      number: "06",
      title: "Canned Heat",
      src: "music/CannedHeat.mp3",
      album: "Synkronized",
      artist: "Jamiroquai",
      albumArt: "img/jamiroquai.png"
    },
    {
      number: "07",
      title: "Drive",
      src: "music/Drive.mp3",
      album: "Make Yourself",
      artist: "Incubus",
      albumArt: "img/incubus.jpg"
    },
    {
      number: "08",
      title: "The Middle",
      src: "music/TheMiddle.mp3",
      album: "Bleed America",
      artist: "Jimmy Eat World",
      albumArt: "img/jimmyeatworld.jpg"
    },
    {
      number: "09",
      title: "Banquet",
      src: "music/Banquet.mp3",
      album: "Silent Alarm",
      artist: "Bloc Party",
      albumArt: "img/blocparty.jpg"
    },
  ];

  let currentSongIndex = 0;

  const $audioPlayer = $("#audio-player");
  const $songNumber = $("#song-number");
  const $songName = $("#song-name");
  const $albumName = $("#album-name");
  const $artistName = $("#artist-name");
  const $albumArt = $("#album-art");
  const $currentTimePlayed = $("#current-time-played");
  const $anotherTimePlayed = $("#another-time-played");

  const $imageUpload = $("#image-upload");
  const $selectImages = $("#select-images");
  const $uploadButton = $("#upload-button");
  const $uploadedImages = $("#uploaded-images");
  const $uploadedImages2 = $("#uploaded-images-2");
  const $selectedFilesDisplay = $("#selected-files");
  const $imagesContainer = $("#images-container");
  const buttonClickSound = new Audio("music/Scanner.mp3");

  let selectedFiles = null;

  function processImage(image, callback) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = image.width;
    const height = image.height;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw the downscaled image to the canvas
    const scaleFactor = 0.25; // Adjust this value to control the pixel size
    ctx.drawImage(image, 0, 0, width * scaleFactor, height * scaleFactor);
    ctx.drawImage(canvas, 0, 0, width * scaleFactor, height * scaleFactor, 0, 0, width, height);

    // Process the image to make it black and white
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const threshold = 115; // Adjust this value to control the contrast
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const color = avg > threshold ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = color;
    }
    ctx.putImageData(imageData, 0, 0);

    // Save the processed image to the DOM
    const $processedImage = $('<img class="processed-image" alt="Processed Image">');
    $processedImage.attr("src", canvas.toDataURL("image/png"));
    $processedImage.attr("title", image.src.split('/').pop());
    $imagesContainer.append($processedImage);

    const fileName = image.src.split('/').pop();
    const $fileNameDisplay = $('<p>').text(fileName);
    const $imageWrapper = $('<div>').append($processedImage.clone(), $fileNameDisplay);

    let currentCount = parseInt($uploadedImages.text(), 10);
    currentCount++;
    $uploadedImages.text(currentCount);
    $uploadedImages2.text(currentCount);

    if (callback) callback();
  }

  function loadImage(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const image = new Image();
      image.onload = function() {
        processImage(image, callback);
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  $selectImages.on("click", function() {
    $imageUpload.click();
  });

  $imageUpload.on("change", function(e) {
    selectedFiles = e.target.files;
    const fileNames = [];
    for (let i = 0; i < selectedFiles.length; i++) {
        let fileName = selectedFiles[i].name;
        if (fileName.length > 16) {
            fileName = fileName.substring(0, 20) + '...';
        }
        fileNames.push(fileName);
    }
    $selectedFilesDisplay.text(fileNames.join(", "));
  });

  $uploadButton.on("click", function() {
    buttonClickSound.play();
    if (selectedFiles && selectedFiles.length > 0) {
      let index = 0;

      function processNext() {
        if (index < selectedFiles.length) {
          loadImage(selectedFiles[index], processNext);
          index++;
        }
      }

      processNext();
    }
  });

  function loadSong(index, autoplay = false) {
    currentSongIndex = index;
    const song = songs[index];
    $songNumber.text(song.number);
    $songName.text(song.title);
    $albumName.text(song.album);
    $artistName.text(song.artist);
    $albumArt.attr("src", song.albumArt);
    $audioPlayer.attr("src", song.src);
    if (autoplay) {
      $audioPlayer[0].play();
    }
  }

  function updateTimePlayed() {
    const currentTime = $audioPlayer[0].currentTime;
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    $currentTimePlayed.text(`${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
    $anotherTimePlayed.text(`${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
  }

  $audioPlayer.on("timeupdate", function() {
    updateTimePlayed($currentTimePlayed);
    updateTimePlayed($anotherTimePlayed);
  });

  $audioPlayer.on("ended", function() {
    const newIndex = (currentSongIndex + 1) % songs.length;
    loadSong(newIndex, true);
  });

  $("#play").on("click", function() {
    $audioPlayer[0].play();
  });

  $("#pause").on("click", function() {
    $audioPlayer[0].pause();
  });

  $("#previous-song").on("click", function() {
    const newIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    const isPlaying = !$audioPlayer[0].paused;
    loadSong(newIndex, isPlaying);
  });

  $("#next-song").on("click", function() {
    const newIndex = (currentSongIndex + 1) % songs.length;
    const isPlaying = !$audioPlayer[0].paused;
    loadSong(newIndex, isPlaying);
  });

  loadSong(0);

  function displayCurrentTime() {
    let currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let timeString = hours + ':' + minutes + ' ' + ampm;
    $('#current-time').text(timeString);
  }
  displayCurrentTime();
  setInterval(displayCurrentTime, 3000);
  $('#power').click(function() {
    $('#power').toggleClass('on');
    $('.wrapper').toggleClass('zoom');
    $('.desktop').toggleClass('on');
  });
  $('#paint').click(function() {
    $('.paint_program').toggleClass('on');
    $('.back_button').toggleClass('on');
  });
  $('#lemmings').click(function() {
    $('.lemmings_program').toggleClass('on');
    $('.back_button').toggleClass('on');
  });
  $('#oregon').click(function() {
    $('.oregon_program').toggleClass('on');
    $('.back_button').toggleClass('on');
  });
  $('#music').click(function() {
    $('.music_app').addClass('on');
  });
  $('#scan').click(function() {
    $('.wrapper').addClass('scanning');
    $('.scan_app').addClass('on');
  });
  $('#photos').click(function() {
    $('.photos_app').addClass('on');
  });
  $('#select-images').click(function() {
    $('.loading_01').addClass('on');
    $('.success_01').removeClass('on');
  });
  $('#upload-button').click(function() {
    $('.success_01').addClass('on');
    $('.loading_01').removeClass('on');
  });
  $('#close-01').click(function() {
    $('.music_app').removeClass('on');
  });
  $('#close-02').click(function() {
    $('.wrapper').removeClass('scanning');
    $('.scan_app').removeClass('on');
  });
  $('#close-03').click(function() {
    $('.photos_app').removeClass('on');
  });
  $('#back_01').click(function() {
    $('.paint_program').removeClass('on');
    $('.lemmings_program').removeClass('on');
    $('.oregon_program').removeClass('on');
    $('.back_button').toggleClass('on');
  });
});
