# 🖼️ Object Detection Web App

A professional, full-stack web application for object detection in images using deep learning. Built with **React** (frontend), **Flask** (backend), and **YOLOv5n** (Ultralytics) for fast and accurate inference. Deployed on **Netlify** (frontend) and **Render** (backend).

---

## 🚀 Live Demo

- **Frontend:** [https://object-detectionapp.netlify.app](https://object-detectionapp.netlify.app)
- **Backend API:** [https://object-detection-app-s1a2.onrender.com](https://object-detection-app-s1a2.onrender.com)

---

## ✨ Features

- **Image Upload:** Upload any image and detect objects with a single click.
- **YOLOv5n Model:** Utilizes the lightweight, high-speed YOLOv5n deep learning model for object detection.
- **Visual Results:** Bounding boxes and labels are drawn directly on the image for instant feedback.
- **Modern UI:** Responsive and user-friendly interface built with React.
- **Cloud Deployment:** Seamlessly deployed using Netlify (frontend) and Render (backend).
- **CORS Enabled:** Secure cross-origin communication between frontend and backend.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), HTML5, CSS3, JavaScript
- **Backend:** Python, Flask, Flask-CORS, Ultralytics YOLOv5n, Pillow
- **Deployment:** Netlify (frontend), Render (backend)
- **Model:** YOLOv5n (Nano) — optimized for CPU inference

---

## 🧑‍💻 How It Works

1. **Upload:** User uploads an image via the React frontend.
2. **Inference:** Image is sent as a POST request to the Flask backend `/detect` endpoint.
3. **Detection:** Backend runs YOLOv5n inference and returns detected objects with bounding boxes and class labels.
4. **Display:** Frontend overlays detection results on the image for clear visualization.

---

## 🏗️ Project Structure

```
object-detection-app/
├── frontend/   # React app (Netlify)
└── backend/    # Flask API (Render)
```

---

## ⚡ Quick Start (Local Development)

### Backend (Flask + YOLOv5n)

```
cd backend
python -m venv venv
```
Activate venv (Windows)
```
venv\Scripts\activate
```
Activate venv (Linux/Mac)
```
source venv/bin/activate
```
```
pip install -r requirements.txt
python main.py
```

### Frontend (React)

```
cd frontend
npm install
npm run dev
```

---

## 🌍 Deployment

- **Frontend:** Deployed on Netlify ([netlify.com](https://netlify.com/))
- **Backend:** Deployed on Render ([render.com](https://render.com/))

---

## 📝 Highlights & Learnings

- **End-to-End Deployment:** Integrated a modern ML model into a scalable web API and deployed both frontend and backend to the cloud.
- **Deep Learning Inference:** Leveraged YOLOv5n for efficient object detection on resource-constrained (free-tier) cloud environments.
- **Full-Stack Integration:** Managed CORS, asynchronous image uploads, and real-time visualization.
- **Performance Optimization:** Tuned model and image sizes for best performance within limited resources.

---

## 📚 References

- [Ultralytics YOLOv5](https://github.com/ultralytics/yolov5)
- [Render Flask Deployment Docs](https://render.com/docs/deploy-flask)
- [Netlify React Deployment Docs](https://docs.netlify.com/configure-builds/get-started/)

---
