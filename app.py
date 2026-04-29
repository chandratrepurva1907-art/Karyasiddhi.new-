from flask import Flask, request, jsonify, render_template, send_from_directory
import json
import os
from datetime import datetime

app = Flask(__name__)

DATA_FILE = "user_data.json"

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/submit", methods=["POST"])
def submit():
    try:
        payload = request.get_json()
        name = payload.get("name", "").strip()
        phone = payload.get("phone", "").strip()
        dob = payload.get("dob", "").strip()
        age = payload.get("age", "").strip()
        email = payload.get("email", "").strip()
        services = payload.get("services", [])

        if not all([name, phone, dob, age, email, services]):
            return jsonify({"success": False, "message": "All fields are required."}), 400

        records = load_data()
        record = {
            "id": len(records) + 1,
            "name": name,
            "phone": phone,
            "dob": dob,
            "age": age,
            "email": email,
            "services": services,
            "submitted_at": datetime.now().isoformat()
        }
        records.append(record)
        save_data(records)

        return jsonify({"success": True, "message": f"Thank you, {name}! We will contact you shortly."})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route("/api/records", methods=["GET"])
def get_records():
    return jsonify(load_data())

if __name__ == "__main__":
    app.run(debug=True, port=5000)
