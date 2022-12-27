import { getDistance, normalize } from "./calc.js";
import { ctx, bulletsArray } from "./main.js";

export default class Bullet {
    constructor(id, x, y, radius, color, from, target) {
        this.id = id;
        this.from = from;

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;

        this.xVector = 0;
        this.yVector = 0;

        this.fly = true;
        this.killing = false;

        this.target = target;

        this.i = 0;
    }

    paint = () => {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.i / 2, this.y - this.i / 2, this.radius + this.i, this.radius + this.i);

        if (this.i >= 0 && this.i < 50) this.i += 0.1;
        //else this.i = 0;
    };

    setVector = (xVector, yVector) => {
        let vectors = normalize(xVector, yVector, getDistance(xVector, yVector));
        this.xVector = vectors.xVector;
        this.yVector = vectors.yVector;
    }

    life = (speed) => {
        let beX = this.x + this.xVector * speed;
        let beY = this.y + this.yVector * speed;
        
        let collision;
        let isCollision;

        const updateCol = () => {
            collision = this.isCollision(beX, beY);
            isCollision = collision !== "white";
        }
        
        updateCol();

        if (isCollision) {
            if (collision === this.target) {
                this.color = "orange";
                this.killFromTimeout(100);
            }
            
            if (Math.abs(this.xVector) > Math.abs(this.yVector)) {
                if (collision === this.target) {
                    this.xVector = this.xVector * Math.random();
                }

                this.xVector = -this.xVector;
                beX = this.x + this.xVector * speed;
                beY += (Math.random() - 0.5) * 3; //разброс
            } else {
                if (collision === this.target) {
                    this.yVector = this.yVector * Math.random();
                }

                this.yVector = -this.yVector;
                beY = this.y + this.yVector * speed;
                beX += (Math.random() - 0.5) * 3;
            }

            updateCol();

            if (isCollision) {
                this.xVector = -this.xVector;
                beX = this.x + this.xVector * speed;
                this.yVector = -this.yVector;
                beY = this.y + this.yVector * speed;
            }
        }

        this.x = beX;
        this.y = beY;
    };

    killFromTimeout = (timeout) => {
        setTimeout(() => this.kill(), timeout);
        this.killing = true;
    }

    kill = () => {
        if (bulletsArray[this.from] != undefined) delete bulletsArray[this.from][this.id];
    }

    isCollision = (x, y) => {
        let colors = ctx.getImageData(x, y, 1, 1).data;
        //console.log(colors);
        if (colors[0] === 0 && colors[1] === 0 && colors[2] === 0 && colors[3] === 255) 
            return "black";

        if (this.target === "red")
            if (colors[0] === 255 && colors[1] === 0 && colors[2] === 0 && colors[3] === 255) 
                return "red";
        
        if (this.target === "green")
            if (colors[0] === 0 && colors[1] > 0 && colors[2] === 0 && colors[3] === 255) 
                return "green";

        return "white";
    };
}