class ToolManager {
    constructor(canvas) {
        this.canvas = canvas;
    }

    crop() {
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

        return new Promise((resolve) => {
            cropRect.on('modified', () => {
                const activeObject = this.canvas.getActiveObject();
                if (activeObject && activeObject.type === 'image') {
                    const cropped = activeObject.toDataURL({
                        left: cropRect.left - activeObject.left,
                        top: cropRect.top - activeObject.top,
                        width: cropRect.width * cropRect.scaleX,
                        height: cropRect.height * cropRect.scaleY,
                    });

                    fabric.Image.fromURL(cropped, (img) => {
                        this.canvas.remove(activeObject);
                        this.canvas.add(img);
                        img.center();
                        this.canvas.remove(cropRect);
                        this.canvas.renderAll();
                        resolve(img);
                    });
                }
            });
        });
    }

    resize(width, height) {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject && activeObject.type === 'image') {
            activeObject.scaleToWidth(width);
            activeObject.scaleToHeight(height);
            this.canvas.renderAll();
        }
    }

    rotate(angle) {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            activeObject.rotate(activeObject.angle + angle);
            this.canvas.renderAll();
        }
    }

    applyFilter(filterName) {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject && activeObject.type === 'image') {
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
            activeObject.filters.push(filter);
            activeObject.applyFilters();
            this.canvas.renderAll();
        }
    }

    adjust(adjustType, value) {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject && activeObject.type === 'image') {
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
            activeObject.filters.push(filter);
            activeObject.applyFilters();
            this.canvas.renderAll();
        }
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

    setBlendMode(blendMode) {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            activeObject.set('globalCompositeOperation', blendMode);
            this.canvas.renderAll();
        }
    }
}
