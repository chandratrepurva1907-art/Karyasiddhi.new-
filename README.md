# Karyasiddhi Consultancy

A web application for Karyasiddhi Consultancy built with Python (Flask) on the backend and HTML/CSS/JS on the frontend. It allows users to submit inquiries and request services.

## Features
- **Frontend Interface**: A user-friendly HTML interface with styling (`style.css`) and dynamic logic (`app.js`).
- **Form Submission**: Users can submit their details including name, phone, date of birth, age, email, and requested services.
- **Data Storage**: User submissions are stored locally in a `user_data.json` file.
- **API Endpoints**:
  - `POST /api/submit`: Accepts JSON payload from the frontend form and stores it.
  - `GET /api/records`: Retrieves and returns all submitted user records.

## Tech Stack
- **Backend**: Python 3, Flask, Gunicorn
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: Local JSON file (`user_data.json`)

## Prerequisites
- [Python 3.x](https://www.python.org/downloads/) installed on your system.

## Setup Instructions

1. **Navigate to the project directory**:
   ```bash
   cd karyasiddhi-consultancy
   ```

2. **Create a virtual environment (Optional but recommended)**:
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install the dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```

5. **Access the application**:
   Open your web browser and navigate to [http://localhost:5000](http://localhost:5000)

## Project Structure
```text
karyasiddhi-consultancy/
│
├── app.py                # Main Flask application file
├── requirements.txt      # Python dependencies (Flask, Gunicorn)
├── user_data.json        # Local data storage for form submissions
├── static/               # Static assets
│   ├── app.js            # Frontend JavaScript logic
│   ├── style.css         # Styling for the application
│   └── (images)          # Various logos and background images
└── templates/            # HTML templates
    └── index.html        # Main webpage interface
```
