var state,startGame,strict,lock,randomNum,turn,colorSeries = [],userSeries = [],position = 0,timeColor,timeBetn,timeInpt,win = false,resetVal,colChPromise;

$(document).ready(function() {
  stateMode();

//Start Game function
$("#start").click(reset);

//setting the game ON/OFF
$("#switch_box").click(stateMode);

$(".green").mousedown(function() {
  gain1.connect(audioContext1.destination);
});

$(".green").mouseup(function() {
  gain1.disconnect(audioContext1.destination);
  userSeries.push(1);
  compareArrays();
});

$(".red").mousedown(function() {
  gain2.connect(audioContext2.destination);
});
$(".red").mouseup(function() {
  gain2.disconnect(audioContext2.destination);
  userSeries.push(2);
  compareArrays();
});

$(".yellow").mousedown(function() {
  gain3.connect(audioContext3.destination);
});
$(".yellow").mouseup(function() {
  gain3.disconnect(audioContext3.destination);
  userSeries.push(3);
  compareArrays();
});

$(".blue").mousedown(function() {
  gain4.connect(audioContext4.destination);
});

$(".blue").mouseup(function() {
  gain4.disconnect(audioContext4.destination);
  userSeries.push(4);
  compareArrays();
});

//strict mode ON/OFF
$(".strict").click(function() {
  if (strict == "off") {
    strict = "on";
    $(".state").css("background-color", "red");
  } else {
    strict = "off";
    $(".state").css("background-color", "black");
  }
});

});

//Audio Setup

//Green Audio
var audioContext1 = new AudioContext();
var gain1 = audioContext1.createGain();
var osc1 = audioContext1.createOscillator();
gain1.gain.value = 0.2;
osc1.frequency.value = 165;
osc1.connect(gain1);
osc1.start(0);

//Red Audio
var audioContext2 = new AudioContext();
var gain2 = audioContext2.createGain();
var osc2 = audioContext2.createOscillator();
gain2.gain.value = 0.2;
osc2.frequency.value = 440;
osc2.connect(gain2);
osc2.start(0);

//Yellow Audio
var audioContext3 = new AudioContext();
var gain3 = audioContext3.createGain();
var osc3 = audioContext3.createOscillator();
gain3.gain.value = 0.2;
osc3.frequency.value = 277;
osc3.connect(gain3);
osc3.start(0);

//Blue Audio
var audioContext4 = new AudioContext();
var gain4 = audioContext4.createGain();
var osc4 = audioContext4.createOscillator();
gain4.gain.value = 0.2;
osc4.frequency.value = 330;
osc4.connect(gain4);
osc4.start(0);

function lockMode() {
  if (lock == "on") {
    lock = "off";
    $(".board").removeClass("disableBtns");
    $(".board").addClass("enableBtns");
  } else if (lock == "off" || lock == undefined) {
    lock = "on";
    $(".board").addClass("disableBtns");
    $(".board").removeClass("enableBtns");
  }
}

function stateMode() {
  if (state == "off") {
    resetVal = false;
    state = "on";
    $(".switch").css("float", "left");
    $("#start").removeClass("disableBtns");
    $("#start").addClass("enableBtns");
    $(".strict").removeClass("disableBtns");
    $(".strict").addClass("enableBtns");
  } else {
    resetVal = true;
    lock = "off";
    lockMode();
    state = "off";
    strict = "off";
    $(".switch").css("float", "right");
    $("#counter").text("");
    $("#start").addClass("disableBtns");
    $("#start").removeClass("enableBtns");
    $(".strict").removeClass("enableBtns");
    $(".strict").addClass("disableBtns");
    $(".state").css("background-color", "black");
  }
}


//function that resets everything
function reset() {
  winState = false;
  lock = "off";
  startGame = "off";
  resetVal = true;
  lockMode();
  gameBlinks("---", 4);
}

//when the game starts function
function gameInit() {
  startGame = "on";
  colorSeries = [];
  userSeries = [];
  turn = 0;
  position = 0;
  resetVal = false;
  turns();
}

function turns() {
  turn++;
  if (turn < 5) {
    timeColor = 800;
    timeBetn = timeColor + 670;
    timeInpt = 4500;
  } else if (turn < 9) {
    timeColor = 700;
    timeBetn = timeColor + 600;
    timeInpt = 3500;
  } else if (turn < 13) {
    timeColor = 550;
    timeBetn = timeColor + 500;
    timeInpt = 3000;
  } else if (turn < 21) {
    timeColor = 450;
    timeBetn = timeColor + 350;
    timeInpt = 2500;
  } else {
    timeColor = 500;
    timeBetn = 0;
    winState();
    return false;
  }
  randomNum = Math.floor(Math.random() * 4) + 1;
  colorSeries.push(randomNum)
  flashingSequence()
}

async function flashingSequence() {
  position = 0;
  userSeries = [];
  if (turn != 21) {
    $("#counter").text(turn);
  }
  for (x = 0; x < colorSeries.length; x++) {
    if (resetVal == true) {
      return false;
    }
    colorChange(colorSeries[x]);
    if (x < colorSeries.length - 1) {
      await delay(timeBetn);
    }
  }
  console.log(colorSeries);
  colChPromise.then(function() {
    if (turn !== 21) {
      lockMode();
    }
  });
}

//Compare Arrays between user input and computer
async function compareArrays() {
  if (userSeries[position] == colorSeries[position]) {
    position++;
  } else {
    error();
  }
  if (position == turn) {
    lockMode();
    await delay(1000);
    //for next turn
    turns();
  }
}

//Error and Timeout funciton
function error() {
  lockMode();
  gameBlinks("!!", 3);
}

//color change
function colorChange(x) {
  colChPromise = new Promise(function(resolve, reject) {
    switch (x) {
      case 1:
        gain1.connect(audioContext1.destination);
        $(".green").addClass("bright");
        tempButtonState = setTimeout(function() {
          gain1.disconnect(audioContext1.destination);
          $(".green").removeClass("bright");
          resolve();
        }, timeColor);
        break;
      case 2:
        gain2.connect(audioContext2.destination);
        $(".red").addClass("bright");
        tempButtonState = setTimeout(function() {
          gain2.disconnect(audioContext2.destination);
          $(".red").removeClass("bright");
          resolve();
        }, timeColor);
        break;
      case 3:
        gain3.connect(audioContext3.destination);
        $(".yellow").addClass("bright");
        tempButtonState = setTimeout(function() {
          gain3.disconnect(audioContext3.destination);
          $(".yellow").removeClass("bright");
          resolve();
        }, timeColor);
        break;
      case 4:
        gain4.connect(audioContext4.destination);
        $(".blue").addClass("bright");
        tempButtonState = setTimeout(function() {
          gain4.disconnect(audioContext4.destination);
          $(".blue").removeClass("bright");
          resolve();
        }, timeColor);
    }
  });
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function gameBlinks(char, times) {
  times += 3;
  var blinksVar = setInterval(async function() {
    times--;
    if ($("#counter").text() == "") {
      $("#counter").text(char);
    } else {
      $("#counter").text("");
    }
    if (state == "off") {
      clearInterval(blinksVar);
      $("#counter").text("");
    }
    if (times == 0) {
      clearInterval(blinksVar);
      await delay(800);
      if ((strict == "on" && win == false) || startGame == "off") {
        gameInit();
      } else if (win == false) {
        flashingSequence();
      }
    }
  }, 500);
}

function winState() {
  colorSeries = [];
  gameBlinks("***", 4);
  flashingSequence();
}
