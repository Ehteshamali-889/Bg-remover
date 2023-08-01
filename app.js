document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const convertBtn = document.getElementById("convertBtn");
    const downloadLink = document.getElementById("downloadLink");

    fileInput.addEventListener("change", handleFileSelect);
    convertBtn.addEventListener("click", convertAndRemoveBackground);

    function handleFileSelect(e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    }

    function convertAndRemoveBackground() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
      
        // Define the color threshold for background removal (for white background in this example)
        const threshold = 200; // Adjust this value based on your image background color
      
        // Iterate through each pixel
        for (let i = 0; i < pixels.length; i += 4) {
          // Get the color channels (R, G, B) and calculate the average intensity
          const red = pixels[i];
          const green = pixels[i + 1];
          const blue = pixels[i + 2];
          const intensity = (red + green + blue) / 3;
      
          // Check if the pixel is close to white (based on the threshold)
          if (intensity >= threshold) {
            // Set the alpha channel (transparency) to 0, making the pixel transparent
            pixels[i + 3] = 0;
          }
        }
      
        // Put the updated image data back to the canvas
        ctx.putImageData(imageData, 0, 0);
      
        // Resize the canvas to the desired width and height (500x500)
        const resizedCanvas = document.createElement("canvas");
        const resizedContext = resizedCanvas.getContext("2d");
        resizedCanvas.width = 500;
        resizedCanvas.height = 500;
      
        // Scale the original canvas image to fit within the new canvas size (aspect ratio preserved)
        const scaleFactor = Math.min(500 / canvas.width, 500 / canvas.height);
        const scaledWidth = canvas.width * scaleFactor;
        const scaledHeight = canvas.height * scaleFactor;
        const offsetX = (500 - scaledWidth) / 2;
        const offsetY = (500 - scaledHeight) / 2;
      
        resizedContext.drawImage(canvas, offsetX, offsetY, scaledWidth, scaledHeight);
      
        const downloadURL = resizedCanvas.toDataURL("image/png");
        downloadLink.href = downloadURL;
        downloadLink.download = "output.png";
        downloadLink.style.display = "block";
      }
      

});
