const API_URL = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";
const API_KEY = "sk-CfbY6oHZayN6Ckys9hDikf84lJzFctA8Isn6AVh3d8fkGnAa";

export async function generateImage(prompt: string): Promise<string> {
  try {
    console.log("Generating image for prompt:", prompt);
    console.log("API KEY:", API_KEY);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: `Create a vibrant, detailed, and engaging illustration for children: ${prompt}. Style: colorful, whimsical, and child-friendly`,
            weight: 1
          },
          {
            text: "ugly, blurry, poor quality, distorted, scary, inappropriate",
            weight: -1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
        style_preset: "fantasy-art"
      })
    });

    console.log("API response status:", response.status);
    console.log("API response text:", await response.text().then(text => text.slice(0, 500)));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.artifacts && result.artifacts.length > 0) {
      console.log("Received image from API.");
      return result.artifacts[0].base64;
    }

    throw new Error('No image generated');
  } catch (error) {
    console.error('Error generating image:', error);
    return ''; // Return empty string to indicate failure
  }
} 