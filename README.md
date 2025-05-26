![image](https://github.com/user-attachments/assets/08a43f22-b2cc-4072-afcc-ed72559974a9)
# 🤖 Funny Mario

**Funny Mario** is a hilarious, AI-powered chatbot that scans PDF books, detects if a message is present, and replies with funny responses and AI-generated images. It combines advanced AI (Gemini + Stable Diffusion) with a slick React frontend, voice interaction, and multilingual capabilities — making conversations not just smart, but fun.

---

## 💡 Features

- 📘 **PDF Message Detection**: Uses `PyMuPDF` to analyze PDF files and check if your message exists in the book.
- 🤖 **AI Chat Engine**: If the message is present, Funny Mario responds in a humorous tone using **Gemini AI**.
- 🎨 **Image Generation**: Automatically creates fun images related to the message with **Stable Diffusion**.
- 🗣️ **Voice Interaction**: 
  - **Voice Search**: Speak instead of typing.
  - **AI Voice Response**: Hear Mario’s reply with AI-generated speech.
- 🌍 **Multilingual Support**: Talk to Funny Mario in various languages.
- ⚡ **Modern Frontend**:
  - Built using **React.js**
  - Smooth animations powered by **GSAP**

---

## 🧱 Tech Stack

- **Backend**: Python, FastAPI/Flask, PyMuPDF, Gemini, Stable Diffusion
- **Frontend**: React.js, TailwindCSS, GSAP
- **AI Tools**: Gemini (Text), Stable Diffusion (Image), TTS/STT (Voice)

---

## 🚀 Installation Guide

### 1. Clone the repository

```bash
git clone https://github.com/kjarir/funny-mario.git
cd funny-mario
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload

<img width="1470" alt="Screenshot 2025-05-26 at 2 49 58 PM" src="https://github.com/user-attachments/assets/45aa4fa3-f90c-45a7-a9fb-91aa972ed35a" />
<img width="1470" alt="Screenshot 2025-05-26 at 2 50 56 PM" src="https://github.com/user-attachments/assets/2b5297e5-2ff8-487b-ab35-d8da70f33353" />
<img width="1470" alt="Screenshot 2025-05-26 at 2 51 12 PM" src="https://github.com/user-attachments/assets/4d1f6d20-dc18-4f2c-befd-77080ca66c3a" />
