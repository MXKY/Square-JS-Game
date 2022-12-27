import Player from "./player.js";
import Enemy from "./enemy.js";
import Map from "./map.js";
import * as Colors from "./colors.js";
import { getVector } from "./calc.js";

const cnv = document.getElementById("cnv");
cnv.willReadFrequently = true;
export const ctx = cnv.getContext("2d");

const width = cnv.width = window.innerWidth;
const height = cnv.height = window.innerHeight;

window.requestAnimationFrame(update);

let mouseCoords = { x: 0, y: 0 };

export const entityArray = Array();

const garry = new Player(entityArray.length, 50, 50, 450, 350, "Garry");
entityArray.push(garry);

const enemy1 = new Enemy(entityArray.length, 50, 50, 1150, 350, "Enemy", garry);
entityArray.push(enemy1);
const enemy2 = new Enemy(entityArray.length, 50, 50, 1250, 350, "Enemy", garry);
entityArray.push(enemy2);
const enemy3 = new Enemy(entityArray.length, 50, 50, 1150, 450, "Enemy", garry);
entityArray.push(enemy3);
const enemy4 = new Enemy(entityArray.length, 50, 50, 1250, 450, "Enemy", garry);
entityArray.push(enemy4);

const enemy5 = new Enemy(entityArray.length, 50, 50, 1350, 350, "Enemy", garry);
entityArray.push(enemy5);
const enemy6 = new Enemy(entityArray.length, 50, 50, 1450, 150, "Enemy", garry);
entityArray.push(enemy6);
const enemy7 = new Enemy(entityArray.length, 50, 50, 1350, 450, "Enemy", garry);
entityArray.push(enemy7);
const enemy8 = new Enemy(entityArray.length, 50, 50, 1450, 650, "Enemy", garry);
entityArray.push(enemy8);

const block1 = new Enemy(entityArray.length, 10, 150, 500, 100, "Block", garry);
block1.peace = true;
block1.color = "black";
entityArray.push(block1);
const block2 = new Enemy(entityArray.length, 10, 150, 800, 500, "Block", garry);
block2.peace = true;
block2.color = "black";
entityArray.push(block2);


export const bulletsArray = Array(entityArray.length);
for (var i = 0; i < bulletsArray.length; i++) {
    bulletsArray[i] = new Array();
  }

const firstMap = new Map(100, Colors.wallColor);

function update() {
    ctx.clearRect(0, 0, width, height);

    firstMap.paint(ctx);

    entityArray.forEach((entity) => {
        entity.life(mouseCoords.x, mouseCoords.y);
    });

    bulletsArray.forEach((item, index, array) =>
        bulletsArray[index].forEach((bullet) => {
            bullet.life(entityArray[index].bulletSpeed);
            bullet.paint();
        }));
        
    entityArray.forEach((entity) => {
        entity.checkAttack();
    });

    

    window.requestAnimationFrame(update);
}

document.addEventListener('keydown', (event) => {
    if (event.repeat == true) return;

    if (event.code == "KeyW")
        garry.moveUp();
    if (event.code == "KeyS")
        garry.moveDown();
    if (event.code == "KeyA")
        garry.moveLeft();
    if (event.code == "KeyD")
        garry.moveRight();
});

let fireInterval = 0;

document.addEventListener('mousedown', (event) => {
    startAttack(event);
});

document.addEventListener('mousemove', (event) => {
    mouseCoords = getMousePosition(event);
});

function startAttack(event) {
    fireInterval = setInterval(() => {
        garry.attack();
    }, 250);
}

document.addEventListener('mouseup', (event) => {
    clearInterval(fireInterval);
});

function getMousePosition(event) {
	let x = 0;
    let y = 0;
 
	if (!event) {
		let event = window.event;
	}
 
	if (event.pageX || event.pageY){
		x = event.pageX;
		y = event.pageY;
	} else if (event.clientX || event.clientY){
		x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
 
	return { x: x, y: y }
}