import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Konva from 'konva';
import { Stage, Layer, Rect, Text } from 'react-konva'


function calcDist(movebox, unmovebox) {
    var x1 = movebox.x(), x2 = unmovebox.x(),
        y1 = movebox.y(), y2 = unmovebox.y();
    var dist = Math.abs(x1 - x2) * Math.abs(x1 - x2) + Math.abs(y1 - y2) * Math.abs(y1 - y2);
    dist = Math.floor(Math.sqrt(dist));
    return dist
}

var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'purple'];
var colorIndex = 0;

var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var scoreBoard = {
    'Perfect': 0,
    'Good': 0,
    'Bad': 0,
    'Miss': 0,
}
var scoreText = new Konva.Text({
    x: 10,
    y: 30,
    text: 'Perfect: ' + scoreBoard.Perfect + '\n\n' + 'Good: ' + scoreBoard.Good + '\n\n' + 'Bad: ' + scoreBoard.Bad + '\n\n' + 'Miss: ' + scoreBoard.Miss + '\n\n',
    fontSize: 20,
    fontFamily: 'Calibri',
    fill: 'white',
    width: 300,
    padding: 20,
    // align: 'center'
});

var scoreLayer = new Konva.Layer();
scoreLayer.add(scoreText);
stage.add(scoreLayer);

function changeScoreBoard() {
    //var node = stage.find('Text');
    stage.find('Text').destroy();
    var newScore = new Konva.Text({
        x: 10,
        y: 30,
        text: 'Perfect: ' + scoreBoard.Perfect + '\n\n' + 'Good: ' + scoreBoard.Good + '\n\n' + 'Bad: ' + scoreBoard.Bad + '\n\n' + 'Miss: ' + scoreBoard.Miss + '\n\n',
        fontSize: 20,
        fontFamily: 'Calibri',
        fill: 'white',
        width: 300,
        padding: 20,
        // align: 'center'
    });
    scoreLayer.clearBeforeDraw(true);
    scoreLayer.add(newScore);
    stage.add(scoreLayer);
    //console.log(node.text().toString());
}

var timeRect = new Konva.Rect({
    x: 0,
    y: 0,
    width: width,
    height: 20,
    fill: 'grey',
});

var timeLayer = new Konva.Layer();
timeLayer.add(timeRect);
stage.add(timeLayer);

function changeTimer(clickStatus) {

    var tmpTimeRect = new Konva.Rect({});
    tmpTimeRect = timeLayer.find('Rect')[0];

    timeLayer.find('Rect').destroy();
    if (clickStatus === 'perfect') {
        // if (tmpLayer.width <= stage.getWidth() - 50) {
        //     tmpLayer.width += 50;
        // } else {
        //     tmpLayer.width = stage.getWidth();
        // }
        tmpTimeRect.width(tmpTimeRect.width() + 200);
    }
    else if (clickStatus === 'good') {
        if (tmpTimeRect.width() - 150 < 0) {
            tmpTimeRect.width(0);
        }
        else {
            tmpTimeRect.width(tmpTimeRect.width() + 150);
        }
    }
    else if (clickStatus === 'bad') {
        if (tmpTimeRect.width() - 100 < 0) {
            tmpTimeRect.width(0);
        }
        else {
            tmpTimeRect.width(tmpTimeRect.width() + 100);
        }
    }
    else if (clickStatus === 'miss') {
        if (tmpTimeRect.width() - 100 < 0) {
            tmpTimeRect.width(0);
        }
        else {
            tmpTimeRect.width(tmpTimeRect.width() - 100);
        }
    }
    timeLayer.clearBeforeDraw(true);
    timeLayer.add(tmpTimeRect);
    stage.add(timeLayer);
}

function pressMusic() {
    var audio = document.getElementById("click");
    audio.play();
}

function makePairBox() {

    var layer = new Konva.Layer();

    // [50,height-50]
    // [50,width-50]
    var randomH = Math.floor(Math.random() * ((stage.getHeight() - 100) - 100 + 1) + 100);
    var randomW = Math.floor(Math.random() * ((stage.getWidth() - 100) - 100 + 1) + 100);
    var urandomH = Math.floor(Math.random() * ((stage.getHeight() - 100) - 100 + 1) + 100);
    var urandomW = Math.floor(Math.random() * ((stage.getWidth() - 100) - 100 + 1) + 100);

    var color = colors[colorIndex++];
    if (colorIndex >= colors.length) {
        colorIndex = 0;
    }

    var unmovebox = new Konva.Rect({
        x: urandomW,
        y: urandomH,
        width: 100,
        height: 100,
        fill: color,
        stroke: 'black',
        opactity: 0.5,
        strokeWidth: 4
    });

    var movebox = new Konva.Rect({
        x: randomW,
        y: randomH,
        width: 100,
        height: 100,
        fill: color,
        stroke: 'black',
        strokeWidth: 4
    });

    movebox.on('mousedown', function () {
        pressMusic();
        //console.log('click on movebox in ' + movebox.x() + ' ' + movebox.y());
        var dist = Math.floor(calcDist(movebox, unmovebox));
        if (dist <= 30) {
            scoreBoard.Perfect++;
            //console.log('Perfect: ' + scoreBoard.Perfect);
            if (scoreBoard.Miss >= 1) {
                scoreBoard.Miss--;
            } else {
                scoreBoard.Miss = 0;
            }
            changeScoreBoard();
            changeTimer('perfect');
            layer.remove(movebox, unmovebox);
        }
        else if (dist <= 40) {
            scoreBoard.Good++;
            //console.log('Good: ' + scoreBoard.Good);
            if (scoreBoard.Miss >= 1) {
                scoreBoard.Miss--;
            } else {
                scoreBoard.Miss = 0;
            }
            changeScoreBoard();
            changeTimer('good');
            layer.remove(movebox, unmovebox);
        }
        else if (dist <= 45) {
            scoreBoard.Bad++;
            //console.log('Bad: ' + scoreBoard.Bad);
            if (scoreBoard.Miss >= 1) {
                scoreBoard.Miss--;
            } else {
                scoreBoard.Miss = 0;
            }
            changeScoreBoard();
            changeTimer('bad');
            layer.remove(movebox, unmovebox);
        }
        else {
            scoreBoard.Miss++;
            if (scoreBoard.Miss >= 1) {
                scoreBoard.Miss--;
            } else {
                scoreBoard.Miss = 0;
            }
            changeScoreBoard();
            changeTimer('miss');
            //console.log('Miss: ' + scoreBoard.Miss);
            layer.remove(movebox, unmovebox);
        }
    });

    var velocity = 300;
    var dist = calcDist(movebox, unmovebox);
    var duration = dist / velocity;

    layer.add(unmovebox, movebox);

    movebox.to({
        x: urandomW,
        y: urandomH,
        opactity: 0.5,
        duration: duration,
        onFinish: function () {
            scoreBoard.Miss++;
            changeScoreBoard();
            changeTimer('miss');
            layer.remove(movebox, unmovebox);
        }
    });
    return layer;
}

function play() {
    stage.add(makePairBox());
}

function addBg() {
    var bgLayer = new Konva.Layer();
    var imageObj = new Image();
    imageObj.onload = function () {

        var yoda = new Konva.Image({
            x: 0,
            y: 0,
            image: imageObj,
            width: width,
            height: height
        });
        bgLayer.add(yoda);
        stage.add(bgLayer);

    };
    imageObj.src = "../bg.gif";
}

addBg();
var player = window.setInterval(play, 2000);
setTimeout(player, 2000);
var audio = document.getElementById("bgMusic");
audio.volume = 0.5;
audio.play();


// ReactDOM.render(<App />, document.getElementById('root'));
