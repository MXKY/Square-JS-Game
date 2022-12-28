export class MotionFeatures {
    constructor(mathFunction) {
        this.scale = 0;
        this.reverseScale = false;
        this.minScale = 0;
        this.maxScale = 5;

        this.mathFunctionActive = false;
        this.mathFunction = mathFunction;
        this.mathFunctionTimeoutId = 0;
    }

    getScale = (increment) => {
        if (this.scale >= this.minScale && this.scale < this.maxScale) 
            this.scale += increment;

        return this.scale;
    }

    invokeMathFunc = (x, y) => {
        if (this.mathFunctionActive) {
            return this.mathFunction(x, y);
        }
        else
            return { resultX: 0, resultY: 0 };
    }

    startMathFunction = (timeout) => {
        this.mathFunctionActive = true;

        if (timeout == 0) return;

        if (this.mathFunctionTimeoutId != 0)
            clearTimeout(this.mathFunctionTimeoutId);
        
        this.mathFunctionTimeoutId = setTimeout(() => {
            this.mathFunctionActive = false;
            this.mathFunctionTimeoutId = 0;
        }, timeout);
    }
}