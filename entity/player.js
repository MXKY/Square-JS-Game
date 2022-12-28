import Bullet from "./bullet.js";
import { playerColor } from "../colors.js";
import { getVector } from "../math/calc.js";
import { ctx, entityArray, bulletsArray } from "../main.js";

export default class Player {
    constructor(id, width, height, x, y, name) {
        this.id = id;
        this.name = name;

        this.color = playerColor;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speed = (this.width + this.height) / 2;
        this.animSpeed = this.speed / 10;

        this.xCenter = this.getCenterX(this.x);
        this.yCenter = this.getCenterY(this.y);

        this.xComing = 0;
        this.yComing = 0;

        this.health = 200;
        this.killing = false;

        this.bulletLifetime = 3000;
        this.bulletSpeed = 6;
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

        ctx.fillStyle = "maroon";
        ctx.fillRect(this.x + 10, this.y + this.height - 15, this.health / 6, 10);
    };

    attack = () => {
        let bullet = new Bullet(bulletsArray[this.id].length, this.xCenter, this.yCenter, 4, this.color, this.id, "green");
        bulletsArray[this.id].push(bullet);
    };

    killFromTimeout = (timeout) => {
        setTimeout(() => this.kill(), timeout);
        this.killing = true;
    };

    kill = () => { 
        delete bulletsArray[this.id];
        delete entityArray[this.id];
    }

    getCenterX = (x) => x += this.width / 2;
    getCenterY = (y) => y += this.height / 2;

    life = (mouseX, mouseY) => {
        if (this.xComing < 0) {
            this.move(this.x + this.animSpeed, this.y);
            this.xComing += this.animSpeed;
        }
        else
        if (this.xComing > 0) {
            this.move(this.x - this.animSpeed, this.y);
            this.xComing -= this.animSpeed;
        }
        else
        if (this.yComing < 0) {
            this.move(this.x, this.y + this.animSpeed);
            this.yComing += this.animSpeed;
        }
        else
        if (this.yComing > 0) {
            this.move(this.x, this.y - this.animSpeed);
            this.yComing -= this.animSpeed;
        }

        this.paint();

        if (bulletsArray[this.id].length > 0) {
            bulletsArray[this.id].forEach((bullet) => {
                let vector = getVector(this.xCenter, this.yCenter, mouseX, mouseY);
    
                if (!bullet.killing) {
                    bullet.setVector(vector.xVector, vector.yVector);
                    bullet.killFromTimeout(this.bulletLifetime);
                }
            });
        }
    }

    isCollision = (x, y) => {
        let colors = ctx.getImageData(this.getCenterX(x > this.x ? x - 10 : x + 10), this.getCenterY(y > this.y ? y - 10 : y + 10), 1, 1).data;
        if (colors[3] === 255) return true;
    };

    checkAttack = () => {
        let isAttack = false;

        for (let i = 0; i <= this.width - 1; i++) {
            let colors = ctx.getImageData(this.x + i, this.y - 2, 1, 1).data;
            if (colors[1] > 0) isAttack = true;
        }

        if (!isAttack)
            for (let i = 0; i <= this.width - 1; i++) {
                let colors = ctx.getImageData(this.x + i, this.y + this.height + 2, 1, 1).data;
                if (colors[1] > 0) isAttack = true;
            }

        if (!isAttack)
            for (let i = 0; i <= this.height - 1; i++) {
                let colors = ctx.getImageData(this.x - 2, this.y + i, 1, 1).data;
                if (colors[1] > 0) isAttack = true;
            }

        if (!isAttack)
            for (let i = 0; i <= this.height - 1; i++) {
                let colors = ctx.getImageData(this.x + this.width + 2, this.y + i, 1, 1).data;
                if (colors[1] > 0) isAttack = true;
            }

        if (isAttack) {
            this.color = "gray";
            this.health -= 1;
            if (this.health <= 0)
                this.kill();
            setTimeout(() => this.color = playerColor, 30);
        }
    }
}