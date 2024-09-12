class ImageEditor {
    constructor(canvasId) {
        this.canvas = new fabric.Canvas(canvasId, {
            width: window.innerWidth,
            height: window.innerWidth
        });
        this.canvas.setBackgroundColor('#ffffff', this.canvas.renderAll.bind(this.canvas));
        this.currentImage = null;
        this.operations = [];
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            fabric.Image.fromURL(url, (img) => {
                this.currentImage = img;
                this.canvas.clear();
                this.canvas.add(img);
                this.canvas.centerObject(img);
                this.canvas.setActiveObject(img);
                this.canvas.renderAll();
                resolve();
            }, { crossOrigin: 'anonymous' });
        });
    }

    crop() {
        if (!this.currentImage) return;
        const cropRect = new fabric.Rect({
            fill: 'rgba(0,0,0,0.3)',
            originX: 'left',
            originY: 'top',
            stroke: '#ccc',
            strokeDashArray: [2, 2],
            opacity: 1,
            width: 100,
            height: 100,
        });

        this.canvas.add(cropRect);
        this.canvas.setActiveObject(cropRect);
        this.canvas.renderAll();

        cropRect.on('modified', () => {
            const cropped = this.currentImage.toDataURL({
                left: cropRect.left,
                top: cropRect.top,
                width: cropRect.width * cropRect.scaleX,
                height: cropRect.height * cropRect.scaleY,
            });

            fabric.Image.fromURL(cropped, (img) => {
                this.canvas.remove(cropRect);
                this.canvas.remove(this.currentImage);
                this.currentImage = img;
                this.canvas.add(img);
                this.canvas.centerObject(img);
                this.canvas.setActiveObject(img);
                this.canvas.renderAll();
            });
        });
    }

    resize(width, height) {
        if (!this.currentImage) return;
        this.currentImage.scaleToWidth(width);
        this.currentImage.scaleToHeight(height);
        this.canvas.renderAll();
    }

    rotate(angle) {
        if (!this.currentImage) return;
        this.currentImage.rotate(this.currentImage.angle + angle);
        this.canvas.renderAll();
    }

    applyFilter(filterName) {
        if (!this.currentImage) return;
        let filter;
        switch (filterName) {
            case 'grayscale':
                filter = new fabric.Image.filters.Grayscale();
                break;
            case 'invert':
                filter = new fabric.Image.filters.Invert();
                break;
            case 'sepia':
                filter = new fabric.Image.filters.Sepia();
                break;
        }
        this.currentImage.filters.push(filter);
        this.currentImage.applyFilters();
        this.canvas.renderAll();
    }

    adjust(adjustType, value) {
        if (!this.currentImage) return;
        let filter;
        switch (adjustType) {
            case 'brightness':
                filter = new fabric.Image.filters.Brightness({ brightness: value });
                break;
            case 'contrast':
                filter = new fabric.Image.filters.Contrast({ contrast: value });
                break;
            case 'saturation':
                filter = new fabric.Image.filters.Saturation({ saturation: value });
                break;
        }
        this.currentImage.filters.push(filter);
        this.currentImage.applyFilters();
        this.canvas.renderAll();
    }

    addText(text, options = {}) {
        const textObject = new fabric.Text(text, {
            left: 100,
            top: 100,
            fontFamily: options.fontFamily || 'Arial',
            fontSize: options.fontSize || 20,
            fill: options.color || '#000000'
        });
        this.canvas.add(textObject);
        this.canvas.setActiveObject(textObject);
        this.canvas.renderAll();
    }

    toDataURL() {
        return this.canvas.toDataURL({ format: 'jpeg', quality: 0.8 });
    }
}
