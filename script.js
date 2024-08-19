const API_TOKEN = "YOUR_API_KEY";

const maxImages = 10;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearImageGrid() {
  const imageGallery = document.getElementById("image-grid");
  imageGallery.innerHTML = "";
}

function disableGenerateButton() {
  document.getElementById("generate").disabled = true;
}

function enableGenerateButton() {
  document.getElementById("generate").disabled = false;
}

async function generateImages(input) {
  disableGenerateButton();
  clearImageGrid();

  const loading = document.getElementById("loading");
  loading.style.display = "flex";

  for (let i = 0; i < maxImages; i++) {
    const randomNumber = getRandomNumber(1, 10000);
    const prompt = `${input} ${randomNumber}`;

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
          },
          method: "POST",
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to Generate Images");
      }

      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);

      const img = document.createElement("img");
      img.src = imgUrl;
      img.alt = `art-${i + 1}`;
      img.onclick = () => downloadImage(imgUrl, i);
      document.getElementById("image-grid").appendChild(img);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate images. Please try again later.");
      break;
    }
  }
  loading.style.display = "none";
  enableGenerateButton();
}

function downloadImage(imgUrl, imageNumber) {
  const link = document.createElement("a");
  link.href = imgUrl;
  link.download = `image-${imageNumber + 1}.jpg`;
  link.click();
}

document.getElementById("generate").addEventListener("click", () => {
  const input = document.getElementById("user-prompt").value;
  generateImages(input);
});
