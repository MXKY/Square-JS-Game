import Bullet from "./bullet.js";
import { enemyColor } from "../colors.js";
import { getVector } from "../math/calc.js";
import { ctx, entityArray, bulletsArray } from "../main.js";

export default class Enemy {
    constructor(id, width, height, x, y, name, target) {
        this.id = id;
        this.name = name;
        this.target = target;

        this.color = enemyColor;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speed = 50;
        this.animSpeed = this.speed / 25;

        this.xCenter = this.getCenterX(this.x);
        this.yCenter = this.getCenterY(this.y);

        this.xComing = 0;
        this.yComing = 0;
        
        this.health = 500;
        this.killing = false;

        this.fireInterval = 0;
        this.moveInterval = 0;

        this.bulletLifetime = 3000;
        this.bulletSpeed = 3;

        this.peace = false;
    }

    move = (x, y) => {
        this.x = x;
        this.y = y;
        
        this.xCenter = this.getCenterX(this.x);
        this.yCenter = this.getCenterY(this.y);
    }

    moveAnim = (x, y) => {
        if (this.xComing != 0 || this.yComing != 0) return;
        if (this.isCollision(x, y)) return;

        this.xComing = this.x - x;
        this.yComing = this.y - y;
    }

    moveUp = () => this.moveAnim(this.x, this.y - this.speed);
    moveDown = () => this.moveAnim(this.x, this.y + this.speed);
    moveLeft = () => this.moveAnim(this.x - this.speed, this.y);
    moveRight = () => this.moveAnim(this.x + this.speed, this.y);

    paint = () => {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (!this.peace) {
            ctx.fillStyle = "maroon";
            ctx.fillRect(this.x + 10, this.y + this.height - 15, this.health / 15, 10);
        }
    };

    attack = () => {
        let bullet = new Bullet(bulletsArray[this.id].length, this.xCenter, this.yCenter, 3, this.color, this.id, this.target.color);
        bulletsArray[this.id].push(bullet);
    };

    killFromTimeout = (timeout) => {
        setTimeout(() => this.kill(), timeout);
        this.killing = true;
    };

    kill = () => { 
        delete bulletsArray[this.id];
        delete entityArray[this.id];
        this.stopAttack();
        this.stopMove();
    }

    getCenterX = (x) => x += this.width / 2;
    getCenterY = (y) => y += this.height / 2;

    life = () => {
        if (!this.peace) this.startAttack(700 * (Math.random() + 0.2));
        this.startMove(1300 * (Math.random() + 0.2));

        if (this.xComing < 0) {
            this.move(this.x + this.animSpeed, this.y);
            this.xComing += this.animSpeed;
        }

        if (this.xComing > 0) {
            this.move(this.x - this.animSpeed, this.y);
            this.xComing -= this.animSpeed;
        }

        if (this.yComing < 0) {
            this.move(this.x, this.y + this.animSpeed);
            this.yComing += this.animSpeed;
        }

        if (this.yComing > 0) {
            this.move(this.x, this.y - this.animSpeed);
            this.yComing -= this.animSpeed;
        }
        
        this.paint();

        if (bulletsArray[this.id].length > 0) {
            bulletsArray[this.id].forEach((bullet) => {
                let vector = getVector(this.xCenter, this.yCenter, this.target.xCenter, this.target.yCenter);
    
                if (!bullet.killing) {
                    bullet.setVector(vector.xVector, vector.yVector);
                    bullet.killFromTimeout(this.bulletLifetime);
                }
                
                bullet.life(this.bulletSpeed);
            });
        }
    }

    isCollision = (x, y) => {
        let colors = ctx.getImageData(this.getCenterX(x > this.x ? x - 10 : x + 10), this.getCenterY(y > this.y ? y - 10 : y + 10), 1, 1).data;
        if (colors[3] === 255) return true;
    };

    checkAttack = () => {
        if (this.peace) return;

        let isAttack = false;

        for (let i = 0; i <= this.width - 1; i++) {
            let colors = ctx.getImageData(this.x + i, this.y - 2, 1, 1).data;
            if (colors[0] > 0) isAttack = true;
        }

        if (!isAttack)
            for (let i = 0; i <= this.width - 1; i++) {
                let colors = ctx.getImageData(this.x + i, this.y + this.height + 2, 1, 1).data;
                if (colors[0] > 0) isAttack = true;
            }

        if (!isAttack)
            for (let i = 0; i <= this.height - 1; i++) {
                let colors = ctx.getImageData(this.x - 2, this.y + i, 1, 1).data;
                if (colors[0] > 0) isAttack = true;
            }

        if (!isAttack)
            for (let i = 0; i <= this.height - 1; i++) {
                let colors = ctx.getImageData(this.x + this.width + 2, this.y + i, 1, 1).data;
                if (colors[0] > 0) isAttack = true;
            }

        if (isAttack) {
            this.color = "gray";
            this.health -= 2;
            if (this.health <= 0)
                this.kill();
            setTimeout(() => this.color = enemyColor, 30);
        }
    }

    startAttack = (interval) => {
        if (this.fireInterval != 0) return;

        this.fireInterval = setInterval(() => {
            this.attack();
        }, interval);
    }
    stopAttack = () => clearInterval(this.fireInterval);

    startMove = (interval) => {
        if (this.moveInterval != 0) return;
        
        this.moveInterval = setInterval(() => {
            if (Math.random() < 0.50) {
                if (Math.random() < 0.50)
                    for (let i = 1; i <= 5 * Math.random(); i++ ) this.moveUp();
                else
                    for (let i = 1; i <= 5 * Math.random(); i++ ) this.moveDown();

                if (Math.random() < 0.70)
                    for (let i = 1; i <= 5 * Math.random() + 1; i++ ) this.moveLeft();
                else
                    for (let i = 1; i <= 5 * Math.random() + 1; i++ ) this.moveRight();
            }}, interval);
    }
    stopMove = () => clearInterval(this.moveInterval);
}