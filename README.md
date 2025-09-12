# KPR-Hackathon

`https://github.com/Agiless/KPR-Hackathon.git`

I’ll enhance the **humanized README** by:

* Adding **GitHub clone instructions** with your actual repo URL.
* Linking your repo under project title.
* Making the README feel like a polished open-source project page.

Here’s the improved **final README.md** 👇

---

# Aura: AI-Powered Mall Assistant

[![GitHub Repo](https://img.shields.io/badge/GitHub-KPR--Hackathon-blue?logo=github)](https://github.com/Agiless/KPR-Hackathon.git)

> 🌟 Aura is your **personal mall companion**. It helps shoppers find stores, discover products, navigate malls in 3D, and even stay safe with real-time SOS alerts. Built during the **KPR Hackathon**, Aura reimagines the way we experience shopping malls.

---

## 📖 Table of Contents

* [Why We Built Aura](#why-we-built-aura)
* [Our Solution](#our-solution)
* [What Aura Can Do](#what-aura-can-do)
* [How It Works](#how-it-works)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Using Aura](#using-aura)
* [Configuration](#configuration)
* [Roadmap](#roadmap)
* [Impact](#impact)
* [Team](#team)
* [Contributing](#contributing)
* [License](#license)
* [Acknowledgements](#acknowledgements)

---

## ❓ Why We Built Aura

If you’ve ever been lost in a mall trying to find a store, struggled to locate parking, or panicked when you couldn’t find your family in a crowd — you know the frustration.

Malls are exciting, but they can also be overwhelming. **Aura exists to make that experience effortless and safe.**

---

## 💡 Our Solution

Aura is an **all-in-one mall assistant** that:

* Answers shopper queries with **AI-powered chat**.
* Finds products just by **snapping a photo**.
* Offers **3D indoor navigation** so you’ll never be lost again.
* Provides **community safety features (SOS alerts)**.
* Helps retailers **increase visibility and engagement**.

---

## ✨ What Aura Can Do

✔ **Conversational AI** – Chat with Aura for directions, store info, and promotions.
✔ **Visual Product Search** – Upload a product image to find matches inside the mall.
✔ **3D Indoor Navigation** – Interactive map with shortest-path guidance.
✔ **Parking & Service Finder** – Check live availability.
✔ **SOS Safety System** – Trigger alerts in case of emergencies.

---

## 🏗️ How It Works

* **Frontend** → React.js + TailwindCSS + Blender models.
* **Backend** → Django REST APIs.
* **Databases** → PostgreSQL (structured), MongoDB (catalogs), Vector DB (search).
* **AI Modules** →

  * Qwen-3 LLM (with RAG) for chat.
  * CLIP for product image embeddings.
  * BFS/A\* for navigation.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, TailwindCSS, Blender (3D maps)
* **Backend**: Django REST APIs (Python)
* **Databases**: PostgreSQL, MongoDB, Vector DB
* **AI/ML**: Qwen-3 LLM, CLIP (vision search), BFS/A\* (pathfinding)
* **Tools**: Docker, Git, Node.js, Python

---

## 📂 Project Structure

```
Aura-Mall-Assistant/
├── app/                # Frontend (React.js)
├── backend/            # Backend (Django APIs)
├── chatbot/            # Conversational AI logic
├── product_search/     # Visual product finder
├── navigation/         # Indoor navigation & 3D maps
├── requirements.txt    # Python dependencies
└── README.md
```

---

## ⚙️ Getting Started

Clone the repository:

```bash
git clone https://github.com/Agiless/KPR-Hackathon.git
cd KPR-Hackathon
```

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows
pip install -r ../requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd app
npm install
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

### AI Modules

```bash
cd chatbot
python chatbot_main.py

cd product_search
python recommender.py
```

---

## 🖥️ Using Aura

Once servers are running, you can:

* Chat with the AI for mall queries.
* Upload product photos to search.
* Explore a **3D indoor map**.
* Trigger SOS alerts for emergencies.

Example APIs:

* `POST /api/auth/login` – login
* `GET /api/products` – fetch products
* `POST /api/products/recommend` – get recommendations

---

## 🔑 Configuration

Create a `.env` file:

```
DATABASE_URL=mongodb://localhost:27017/aura
SECRET_KEY=supersecret123
VITE_API_URL=http://127.0.0.1:8000
```

---

## 🗺️ Roadmap

**Phase 1 – Hackathon MVP** → Visual product search + 3D navigation.
**Phase 2 – Pilot** → Partner with a mall in Chennai/Tiruchirappalli.
**Phase 3 – Scale** → Multi-mall rollout, AR navigation, analytics dashboards.

---

## 💼 Impact

* **Shoppers** → Stress-free, safe, and smarter shopping.
* **Retailers** → More visibility, better sales via promotions & discovery.
* **Mall Management** → Insights, engagement, and real-time safety.

---

## 👨‍💻 Team

* **Mirun Kaushik** – Vision & Architecture
* **Agiless Deepakram** – Backend & AI Integration
* **Manojkumar** – Frontend & 3D Models

---

## 🤝 Contributing

We’d love your contributions 🚀

1. Fork the repo → [KPR-Hackathon](https://github.com/Agiless/KPR-Hackathon.git)
2. Create a branch: `git checkout -b feature/new-feature`
3. Commit: `git commit -m "Added new feature"`
4. Push & open a Pull Request.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🙌 Acknowledgements

* [React.js](https://react.dev/)
* [Django](https://www.djangoproject.com/)
* [MongoDB](https://www.mongodb.com/)
* [Blender](https://www.blender.org/)
* [Qwen-3 LLM](https://huggingface.co/)
* Hackathon mentors, teammates, and **KPR Hackathon** ❤️

---

## 🏅 Badges

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Python](https://img.shields.io/badge/python-3.8+-blue)
![Frontend](https://img.shields.io/badge/frontend-react-orange)
![License](https://img.shields.io/badge/license-MIT-green)

---

✨ Aura isn’t just a hackathon project. It’s our **vision for smarter, safer, and more engaging malls**.

---