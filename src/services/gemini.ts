const API_KEY = "AIzaSyDKc3ZHVRa_q335956mUCwSBzYU3OJjGgo";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export async function getFunnyResponse(prompt: string): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Tell this story in a very funny, silly tone for kids: ${prompt}`
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error getting funny response:', error);
    return "Oops! I tripped over my own feet while trying to be funny! 🤪";
  }
} 