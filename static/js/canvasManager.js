class CanvasManager {
    constructor(canvasId) {
        this.canvas = new fabric.Canvas(canvasId);
        this.initializeCanvas();
        this.setupEventListeners();
    }

    initializeCanvas() {
        this.resizeCanvas();
        this.canvas.setBackgroundColor('#ffffff', this.canvas.renderAll.bind(this.canvas));
    }

    resizeCanvas() {
        const container = document.getElementById('imageContainer');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        this.canvas.setDimensions({
            width: containerWidth,
            height: containerHeight
        });

        this.canvas.renderAll();
    }

    setupEventListeners() {
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        window.addEventListener('orientationchange', this.resizeCanvas.bind(this));
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            fabric.Image.fromURL(url, (img) => {
                const canvasAspectRatio = this.canvas.width / this.canvas.height;
                const imgAspectRatio = img.width / img.height;

                let scaleFactor;
                if (imgAspectRatio > canvasAspectRatio) {
                    scaleFactor = this.canvas.width / img.width;
                } else {
                    scaleFactor = this.canvas.height / img.height;
                }

                img.scale(scaleFactor * 0.9); // Scale to 90% of the canvas size
                img.center();
                resolve(img);
            }, { crossOrigin: 'anonymous' });
        });
    }

    getCanvas() {
        return this.canvas;
    }
}
