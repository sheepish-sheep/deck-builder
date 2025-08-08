# Deck-build

## Overview
This project is a Yu-Gi-Oh! deck builder application. It helps users create and manage card decks with a FastAPI backend and modern web interface.

## Folder Structure
- `FrontEnd/`: User interface (HTML, JS, Node.js/Express)
- `BackEnd/`: FastAPI backend and business logic
- `data/`: Card database files (CSV, JSON, etc.)
- `tests/`: Test scripts and sample data

## Setup
### 1. Environment Variables
No API keys are required for this application.

### 2. Backend Setup
- Install Python dependencies:
  ```
  pip install -r requirements.txt
  ```
- Run the FastAPI backend:
  ```
  uvicorn BackEnd.main:app --reload
  ```

### 3. Frontend Setup
- Install Node.js dependencies:
  ```
  cd FrontEnd
  npm install
  ```
- Start the frontend server:
  ```
  npm start
  ```

## Features
- Deck creation and management
- Card search and filtering
- User authentication
- Deck sharing and collaboration

---
Add more details as your project evolves. 