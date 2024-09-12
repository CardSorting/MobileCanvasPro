class UIManager {
    constructor(editor) {
        this.editor = editor;
        this.initializeUI();
    }

    initializeUI() {
        this.menuToggle = document.getElementById('menuToggle');
        this.toolbox = document.getElementById('toolbox');
        this.fileInput = document.getElementById('fileInput');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.cropBtn = document.getElementById('cropBtn');
        this.resizeBtn = document.getElementById('resizeBtn');
        this.rotateBtn = document.getElementById('rotateBtn');
        this.filterBtn = document.getElementById('filterBtn');
        this.adjustBtn = document.getElementById('adjustBtn');
        this.textBtn = document.getElementById('textBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.newLayerBtn = document.getElementById('newLayerBtn');
        this.blendModeSelect = document.getElementById('blendModeSelect');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.menuToggle.addEventListener('click', () => this.toggleToolbox());
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.cropBtn.addEventListener('click', () => this.editor.crop());
        this.resizeBtn.addEventListener('click', () => this.handleResize());
        this.rotateBtn.addEventListener('click', () => this.handleRotate());
        this.filterBtn.addEventListener('click', () => this.handleFilter());
        this.adjustBtn.addEventListener('click', () => this.handleAdjust());
        this.textBtn.addEventListener('click', () => this.handleAddText());
        this.saveBtn.addEventListener('click', () => this.handleSave());
        this.newLayerBtn.addEventListener('click', () => this.editor.createLayer());
        this.blendModeSelect.addEventListener('change', (e) => this.editor.setBlendMode(e.target.value));
    }

    toggleToolbox() {
        this.toolbox.classList.toggle('visible');
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.filename) {
                    this.editor.loadImage(`/static/uploads/${data.filename}`);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    handleResize() {
        const width = prompt('Enter new width:');
        const height = prompt('Enter new height:');
        if (width && height) {
            this.editor.resize(parseInt(width), parseInt(height));
        }
    }

    handleRotate() {
        const angle = prompt('Enter rotation angle:');
        if (angle) {
            this.editor.rotate(parseInt(angle));
        }
    }

    handleFilter() {
        const filter = prompt('Enter filter name (grayscale, invert, sepia):');
        if (filter) {
            this.editor.applyFilter(filter);
        }
    }

    handleAdjust() {
        const adjustType = prompt('Enter adjustment type (brightness, contrast, saturation):');
        const value = prompt('Enter adjustment value (-1 to 1):');
        if (adjustType && value) {
            this.editor.adjust(adjustType, parseFloat(value));
        }
    }

    handleAddText() {
        const text = prompt('Enter text:');
        if (text) {
            this.editor.addText(text);
        }
    }

    handleSave() {
        const dataURL = this.editor.toDataURL();
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'edited_image.jpg';
        link.click();
    }
}
