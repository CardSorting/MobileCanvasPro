class ImageEditor {
    constructor(canvasId) {
        this.canvasManager = new CanvasManager(canvasId);
        this.canvas = this.canvasManager.getCanvas();
        this.toolManager = new ToolManager(this.canvas);
        this.layerManager = new LayerManager(this.canvas);
    }

    loadImage(url) {
        return this.canvasManager.loadImage(url).then((img) => {
            if (this.layerManager.layers.length === 0) {
                this.layerManager.createLayer();
            }
            this.layerManager.addToActiveLayer(img);
            this.canvas.renderAll();
        });
    }

    crop() {
        return this.toolManager.crop();
    }

    resize(width, height) {
        this.toolManager.resize(width, height);
    }

    rotate(angle) {
        this.toolManager.rotate(angle);
    }

    applyFilter(filterName) {
        this.toolManager.applyFilter(filterName);
    }

    adjust(adjustType, value) {
        this.toolManager.adjust(adjustType, value);
    }

    addText(text, options = {}) {
        this.toolManager.addText(text, options);
    }

    setBlendMode(blendMode) {
        this.toolManager.setBlendMode(blendMode);
    }

    toDataURL() {
        return this.canvas.toDataURL({ format: 'jpeg', quality: 0.8 });
    }

    createLayer() {
        this.layerManager.createLayer();
    }
}

class LayerManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.layers = [];
        this.activeLayer = null;
    }

    createLayer() {
        const layer = new fabric.Group([], {
            left: 0,
            top: 0,
            selectable: false,
            evented: false
        });
        this.layers.push(layer);
        this.canvas.add(layer);
        this.setActiveLayer(this.layers.length - 1);
    }

    setActiveLayer(index) {
        if (index >= 0 && index < this.layers.length) {
            this.activeLayer = this.layers[index];
            this.canvas.setActiveObject(this.activeLayer);
            this.canvas.renderAll();
        }
    }

    addToActiveLayer(object) {
        if (this.activeLayer) {
            this.activeLayer.addWithUpdate(object);
            this.canvas.renderAll();
        } else {
            this.canvas.add(object);
        }
    }
}
