
# KPR-Hackathon (Branch: agilessv0)

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup / Installation](#setup--installation)
  - [Backend](#backend)
  - [Frontend / App](#frontend--app)
  - [Chatbot / Product Recommendation Modules](#chatbot--product-recommendation-modules)
- [Usage](#usage)
- [Environment Variables / Configuration](#environment-variables--configuration)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Project Overview

**KPR-Hackathon** is a full-stack project built during a hackathon. It integrates multiple components to deliver an end-to-end solution, including:

- A backend API for data and business logic
- A frontend web application for user interaction
- A chatbot to assist users
- A product recommendation module to provide intelligent suggestions

The `agilessv0` branch contains the initial functional version with core features.

---

## Features

- User authentication (signup, login, logout)
- Chatbot interaction for assistance and queries
- Product recommendation system
- API endpoints for CRUD operations
- Frontend dashboard for seamless navigation
- Modular architecture for scalability

---

## Folder Structure

```
KPR-Hackathon/
├── .vscode/                   # VSCode settings
├── app/                       # Frontend web application
│   ├── public/
│   └── src/
├── backend/                   # Backend server code
│   ├── models/
│   ├── routes/
│   └── controllers/
├── chatbot/                    # Chatbot logic and scripts
├── product_recommendation/     # Product recommendation system
├── requirements.txt            # Python dependencies
└── README.md                   # Project documentation
```

---

## Tech Stack

### Backend
- **Python** (FastAPI / Flask / Django depending on implementation)
- **MongoDB / PostgreSQL** (Database)
- **REST APIs**

### Frontend
- **React.js / Vite** (for building the user interface)
- **Axios** for API communication
- **TailwindCSS / CSS** for styling

### Chatbot & Recommendation System
- **Python**
- **Machine Learning / NLP Libraries** (e.g., scikit-learn, pandas, numpy)

---

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or above)
- [Python](https://www.python.org/) (v3.8 or above)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/) (or the database you are using)

---

## Setup / Installation

### Clone the Repository

```bash
git clone https://github.com/Agiless/KPR-Hackathon.git
cd KPR-Hackathon
git checkout agilessv0
```

---

### Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate     # macOS / Linux
   venv\Scripts\activate      # Windows
   ```

3. Install required packages:
   ```bash
   pip install -r ../requirements.txt
   ```

4. Configure environment variables (create `.env` in `backend/`):
   ```
   DATABASE_URL=mongodb://localhost:27017/kpr_hackathon
   SECRET_KEY=your_secret_key
   ```

5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will run at: **http://127.0.0.1:8000**

---

### Frontend / App

1. Navigate to the app folder:
   ```bash
   cd app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create an `.env` file for frontend configuration:
   ```
   VITE_API_URL=http://127.0.0.1:8000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Access it at **http://localhost:5173**

---

### Chatbot & Product Recommendation Modules

1. Navigate to the respective folders:
   ```bash
   cd chatbot
   # OR
   cd product_recommendation
   ```

2. Ensure the backend virtual environment is active.

3. Run the chatbot or recommendation scripts:
   ```bash
   python chatbot_main.py
   # or
   python recommender.py
   ```

---

## Usage

1. Start the backend (`uvicorn main:app --reload`).
2. Start the frontend (`npm run dev`).
3. Open **http://localhost:5173** in your browser.
4. Interact with:
   - **Chatbot** via its UI component.
   - **Product recommendation** through dedicated pages or API endpoints.

Example API endpoints:
- `GET /api/products` → Fetch all products
- `POST /api/products/recommend` → Get product recommendations
- `POST /api/auth/login` → User login

---

## Environment Variables / Configuration

| Variable       | Description                     | Example Value                     |
|----------------|--------------------------------|-----------------------------------|
| `DATABASE_URL` | Database connection string     | `mongodb://localhost:27017/kpr`   |
| `SECRET_KEY`   | Backend secret key             | `mysecret123`                      |
| `VITE_API_URL` | Frontend base API URL          | `http://127.0.0.1:8000`           |

---

## Contributing

Contributions are welcome!  
To contribute:

1. Fork this repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add awesome feature"
   ```
4. Push your branch and open a Pull Request.

---

## License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- Hackathon mentors, team members, and contributors

---

## Badges

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Python](https://img.shields.io/badge/python-3.8+-blue)
![Frontend](https://img.shields.io/badge/frontend-react-orange)
![License](https://img.shields.io/badge/license-MIT-green)
