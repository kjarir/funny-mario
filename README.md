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

## 🎥 Demo

Here’s what Funny Mario looks like in action:

<img width="1470" alt="Screenshot 2025-05-26 at 2 53 37 PM" src="https://github.com/user-attachments/assets/10e34c0f-dc28-426e-a37b-530433444904" />

<img width="1470" alt="Screenshot 2025-05-26 at 2 53 29 PM" src="https://github.com/user-attachments/assets/4f714fd1-3917-4c75-b4a8-1b2de16e11f9" />

<img width="1470" alt="Screenshot 2025-05-26 at 2 53 19 PM" src="https://github.com/user-attachments/assets/ac72f69d-a638-4c39-abac-f38a8ffe6566" />

<img width="1470" alt="Screenshot 2025-05-26 at 1 31 48 AM" src="https://github.com/user-attachments/assets/5a60e9b7-d874-45dd-8439-ca18e3b8bba9" />


