from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from ultralytics import YOLO
import io
import os

app = Flask(__name__)
CORS(app,origins=["https://object-detectionapp.netlify.app"])

model = YOLO("yolov5n.pt")

@app.route('/')
def home():
    return "Object Detection API is running."

@app.route('/detect', methods=['GET'])
def detect_get():
    return "Detect GET route reached"

@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    try:
        img_bytes = request.files['image'].read()
        img = Image.open(io.BytesIO(img_bytes))
        img = img.resize((640, 640))
        results = model(img)
        result = results[0]
        detections = []
        boxes = result.boxes
        for box in boxes:
            xmin, ymin, xmax, ymax = box.xyxy[0].tolist()
            conf = float(box.conf[0])
            cls = int(box.cls[0])
            name = model.names[cls] if hasattr(model, "names") else str(cls)
            detections.append({
                "xmin": xmin,
                "ymin": ymin,
                "xmax": xmax,
                "ymax": ymax,
                "confidence": conf,
                "class": cls,
                "name": name
            })
        return jsonify(detections)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)