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

function makePairBox() {

    var layer = new Konva.Layer();

    var randomH = Math.floor(Math.random() * (stage.getHeight() - 50 + 1) + 50);
    var randomW = Math.floor(Math.random() * (stage.getWidth() - 50 + 1) + 50);
    var urandomH = Math.floor(Math.random() * (stage.getHeight() - 50 + 1) + 50);
    var urandomW = Math.floor(Math.random() * (stage.getWidth() - 50 + 1) + 50);

    var color = colors[colorIndex++];
    if (colorIndex >= colors.length) {
        colorIndex = 0;
    }

    var unmovebox = new Konva.Rect({
        x: urandomW,
        y: urandomH,
        width: 50,
        height: 50,
        fill: color,
        stroke: 'black',
        strokeWidth: 4
    });

    var movebox = new Konva.Rect({
        x: randomW,
        y: randomH,
        width: 50,
        height: 50,
        fill: color,
        stroke: 'black',
        strokeWidth: 4
    });

    movebox.on('mousedown', function () {
        //console.log('click on movebox in ' + movebox.x() + ' ' + movebox.y());
        var dist = Math.floor(calcDist(movebox, unmovebox));
        if (dist <= 20) {
            console.log('Perfect');
            layer.remove(movebox, unmovebox);
        }
        else if (dist <= 30) {
            console.log('Good');
            layer.remove(movebox, unmovebox);
        }
        else if (dist <= 35) {
            console.log('Bad');
            layer.remove(movebox, unmovebox);
        }
        else {
            console.log('Miss');
            layer.remove(movebox, unmovebox);
        }
    });

    var velocity = 300;
    var dist = calcDist(movebox, unmovebox);
    var duration = dist / velocity;

    layer.add(unmovebox, movebox);
    //stage.add(layer);


    movebox.to({
        x: urandomW,
        y: urandomH,
        opactity: 0.5,
        duration: duration,
        onFinish: function () {
            layer.remove(movebox, unmovebox);
        }
    });

    return layer;
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
