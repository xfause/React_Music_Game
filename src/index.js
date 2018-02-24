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

// function calcLv(movebox, unmovebox,layer) {

//     var dist = Math.floor(calcDist(movebox, unmovebox));
//     if (dist <= 20) {
//         console.log('Perfect');
//         layer.remove(movebox.unmovebox);
//     }
//     else if (dist <= 30) {
//         console.log('Good');
//         layer.remove(movebox.unmovebox);
//     }
//     else if (dist <= 35) {
//         console.log('Bad');
//         layer.remove(movebox.unmovebox);
//     }
//     else {
//         console.log('Miss');
//         layer.remove(movebox.unmovebox);
//     }
// }

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
    y: 10,
    text: 'Perfect: ' + scoreBoard.Perfect + '\n\n' + 'Good: ' + scoreBoard.Good + '\n\n' + 'Bad: ' + scoreBoard.Bad + '\n\n' + 'Miss: ' + scoreBoard.Miss + '\n\n',
    fontSize: 18,
    fontFamily: 'Calibri',
    fill: '#555',
    width: 300,
    padding: 20,
    // align: 'center'
});

var scoreLayer = new Konva.Layer();
scoreLayer.add(scoreText);
stage.add(scoreLayer);

function changeScoreBoard(){
    //var node = stage.find('Text');
    stage.find('Text').destroy();
    var newScore = new Konva.Text({
        x: 10,
        y: 10,
        text: 'Perfect: ' + scoreBoard.Perfect + '\n\n' + 'Good: ' + scoreBoard.Good + '\n\n' + 'Bad: ' + scoreBoard.Bad + '\n\n' + 'Miss: ' + scoreBoard.Miss + '\n\n',
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: '#555',
        width: 300,
        padding: 20,
        // align: 'center'
    });
    scoreLayer.clearBeforeDraw(true);
    scoreLayer.add(newScore);
    stage.add(scoreLayer);
    //console.log(node.text().toString());
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
            layer.remove(movebox, unmovebox);
        }
    });
    return layer;
}

var timeRect = new Konva.Rect({
    x: 0,
    y: 0,
    width: stage.getWidth(),
    height: 20,
    fill: 'black',
});

function timer(clickStatus) {

    if (clickStatus == 'Perfect') {
        if (timeRect.width <= stage.getWidth() - 50) {
            timeRect.width += 50;
        } else {
            timeRect.width = stage.getWidth();
        }
    }
    else if (clickStatus == 'Good') {
        if (timeRect.width <= stage.getWidth() - 30) {
            timeRect.width += 30;
        } else {
            timeRect.width = stage.getWidth();
        }
    }
    else if (clickStatus == 'Bad') {
        if (timeRect.width <= stage.getWidth() - 10) {
            timeRect.width += 10;
        } else {
            timeRect.width = stage.getWidth();
        }
    }
}
function play() {
    // var boxNum = Math.floor(Math.random()*3) + 1;
    // for (var i = 1; i <= boxNum; i++) {
    //     console.log("box number = " + boxNum);
    //     stage.add(makePairBox());
    // }
    stage.add(makePairBox());
}

var t1 = window.setInterval(play, 2000);

// ReactDOM.render(<App />, document.getElementById('root'));
