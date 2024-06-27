document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
document.getElementById('processImage').addEventListener('click', processImage);

let uploadedImage;

function handleImageUpload(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('imageCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            uploadedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}

function processImage() {
    if (!uploadedImage) {
        alert('Please upload an image first.');
        return;
    }

    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');

    const imageData = uploadedImage;
    const data = imageData.data;

    // Remove background and increase contrast
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Simple background removal (assuming white background)
        if (r > 200 && g > 200 && b > 200) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
        }

        // Increase contrast
        data[i] = contrast(r);
        data[i + 1] = contrast(g);
        data[i + 2] = contrast(b);
    }

    ctx.putImageData(imageData, 0, 0);

    const resultCanvas = document.getElementById('resultCanvas');
    resultCanvas.width = canvas.width;
    resultCanvas.height = canvas.height;
    const resultCtx = resultCanvas.getContext('2d');
    resultCtx.putImageData(imageData, 0, 0);
}

function contrast(value) {
    return Math.min(255, Math.max(0, (value - 128) * 1.5 + 128));
}
