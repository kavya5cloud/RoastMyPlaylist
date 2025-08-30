import html2canvas from "html2canvas";

export async function generateShareableImage(elementId: string): Promise<string> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Element not found for image generation");
  }

  const canvas = await html2canvas(element, {
    backgroundColor: "#1a1a1a",
    scale: 2,
    useCORS: true,
    allowTaint: true
  });

  return canvas.toDataURL("image/png");
}

export function downloadImage(dataUrl: string, filename: string = "roast.png") {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export function shareToTwitter(text: string, imageUrl?: string) {
  const tweetText = `${text} 🔥\n\nGet your playlist roasted at ${window.location.origin}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  window.open(tweetUrl, "_blank");
}

export function shareToInstagram() {
  // Instagram doesn't support direct sharing with URL, so we'll copy to clipboard
  navigator.clipboard.writeText(`Get your playlist roasted at ${window.location.origin} 🔥`);
  alert("Link copied to clipboard! Share it on Instagram Stories 📸");
}

export async function copyShareLink(roastId?: string) {
  const url = roastId 
    ? `${window.location.origin}/roast/${roastId}`
    : window.location.href;
  
  await navigator.clipboard.writeText(url);
  return url;
}
