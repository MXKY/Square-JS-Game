import { getDistance, getVector, normalize } from "../math/calc.js";
import { ctx, bulletsArray } from "../main.js";
import { MotionFeatures } from "../math/motionFeatures.js";

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

        this.motionFeatures = new MotionFeatures((x, y) => {
            let resultX = (Math.sin(x / 10) * 3);
            let resultY = (Math.sin(y / 10) * 3);
            
            if (Math.abs(resultX) > Math.abs(resultY))
                resultY = 0;
            else
                resultX = 0;

            return { resultX, resultY };
        });
    }

    paint = () => {
        let mathFuncResult = this.motionFeatures.invokeMathFunc(this.x, this.y);
        
        ctx.beginPath();
        ctx.arc(this.x  + mathFuncResult.resultX, this.y + mathFuncResult.resultY, this.radius + this.motionFeatures.getScale(0.03), 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.stroke();
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
            this.motionFeatures.startMathFunction(2000);

            if (collision === this.target) {
                this.color = "orange";
                this.killFromTimeout(200);
            }
            
            if (Math.abs(this.xVector) > Math.abs(this.yVector)) {
                if (collision === this.target) {
                    this.xVector = this.xVector;
                }

                this.xVector = -this.xVector;
                beX = this.x + this.xVector * speed;
            } else {
                if (collision === this.target) {
                    this.yVector = this.yVector;
                }

                this.yVector = -this.yVector;
                beY = this.y + this.yVector * speed;
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
        let answer = "white";
        let vector = getVector(this.x, this.y, x, y);

        for (let i = 1; i <= getDistance(vector.xVector, vector.yVector); i++) {
            let colors = ctx.getImageData(x + vector.xVector, y + vector.yVector, 1, 1).data;
            
            if (colors[0] === 0 && colors[1] === 0 && colors[2] === 0 && colors[3] === 255) 
                return "black";

            if (this.target === "red")
                if (colors[0] === 255 && colors[1] === 0 && colors[2] === 0 && colors[3] === 255) 
                    return "red";
            
            if (this.target === "green")
                if (colors[0] === 0 && colors[1] > 0 && colors[2] === 0 && colors[3] === 255) 
                    return "green";
        }

        return answer;
    };
}