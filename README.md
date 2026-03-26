# FinSaathi

FinSaathi is a simple AI-powered finance assistant built to make understanding money, markets, and investments a little less overwhelming.

The idea behind this project was pretty straightforward — instead of jumping between apps, news sites, and complicated dashboards, why not have one place where you can just *ask* and get useful financial insights?

---

## What it does?

FinSaathi lets you interact with an AI assistant that can:

*  Answer finance-related questions in plain English
* Help you think about investments more clearly (not financial advice, just guidance)
* Get responses in simple, understandable language

It’s more like talking to a smart friend who understands finance ,not a complicated trading tool.

---

## How it’s built?

This project uses a clean and simple stack:

* **Frontend:** React.js
* **Backend:** FastAPI (Python)
* **AI Model:** LLaMA 3.3 70B Versatile
* **API Provider:** Groq

The frontend handles the UI and chat experience, while the FastAPI backend connects everything and communicates with the AI model through Groq.

---

## Running it locally

If you want to try it out on your machine:

### 1. Clone the repo

```bash
git clone https://github.com/your-username/finsaathi.git
cd finsaathi
```

### 2. Start the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Start the frontend

```bash
cd reactapp
npm install
npm start
```

Then open:

```
http://localhost:3000
```

---

## 🔐 Environment setup

Create a `.env` file in your backend folder and add your Groq API key:

```
GROQ_API_KEY=your_api_key_here
```

Make sure `.env` is in your `.gitignore` (important!).


##  What could be added next

Some ideas we had (but didn’t fully build yet):

* Portfolio tracking
* Better stock data integration
* Voice assistant 
* Smarter long-term financial planning suggestions

---

## 🤝 Contributing

If you want to improve this project, feel free to fork it and build on top of it. Ideas, fixes, and experiments are all welcome.

---

