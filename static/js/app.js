document.addEventListener('DOMContentLoaded', () => {
    const editor = new ImageEditor('canvas');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const cropBtn = document.getElementById('cropBtn');
    const resizeBtn = document.getElementById('resizeBtn');
    const rotateBtn = document.getElementById('rotateBtn');
    const filterBtn = document.getElementById('filterBtn');
    const adjustBtn = document.getElementById('adjustBtn');
    const textBtn = document.getElementById('textBtn');
    const saveBtn = document.getElementById('saveBtn');

    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
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
                    editor.loadImage(`/static/uploads/${data.filename}`);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    cropBtn.addEventListener('click', () => editor.crop());

    resizeBtn.addEventListener('click', () => {
        const width = prompt('Enter new width:');
        const height = prompt('Enter new height:');
        if (width && height) {
            editor.resize(parseInt(width), parseInt(height));
        }
    });

    rotateBtn.addEventListener('click', () => {
        const angle = prompt('Enter rotation angle:');
        if (angle) {
            editor.rotate(parseInt(angle));
        }
    });

    filterBtn.addEventListener('click', () => {
        const filter = prompt('Enter filter name (grayscale, invert, sepia):');
        if (filter) {
            editor.applyFilter(filter);
        }
    });

    adjustBtn.addEventListener('click', () => {
        const adjustType = prompt('Enter adjustment type (brightness, contrast, saturation):');
        const value = prompt('Enter adjustment value (-1 to 1):');
        if (adjustType && value) {
            editor.adjust(adjustType, parseFloat(value));
        }
    });

    textBtn.addEventListener('click', () => {
        const text = prompt('Enter text:');
        if (text) {
            editor.addText(text);
        }
    });

    saveBtn.addEventListener('click', () => {
        const dataURL = editor.toDataURL();
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'edited_image.jpg';
        link.click();
    });
});
