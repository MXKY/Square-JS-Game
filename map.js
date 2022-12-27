export default class Map {
    constructor(cellWidth, borderColor) {
        this.cellWidth = cellWidth;
        this.borderColor = borderColor;
        this.borderWidth = this.cellWidth / 2;
        this.verticalCells = 8;
        this.sideBorderHeight = this.verticalCells * this.cellWidth;
    }

    paint = (ctx) => {
        ctx.fillStyle = this.borderColor;
        ctx.fillRect(0, 0, window.innerWidth, this.borderWidth);
        ctx.fillRect(0, 0, this.borderWidth, this.sideBorderHeight);
        ctx.fillRect(0, this.sideBorderHeight - this.borderWidth, window.innerWidth, this.borderWidth);
        ctx.fillRect(window.innerWidth - this.borderWidth, 0, this.borderWidth, this.sideBorderHeight);
    };
}