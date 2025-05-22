from flask import Flask, request, jsonify
from PIL import Image
import torch
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

from ultralytics import YOLO
model = YOLO("yolov5s.pt")

@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    try:
        img_bytes = request.files['image'].read()
        img = Image.open(io.BytesIO(img_bytes))
        results = model(img)
        # results is a list; get the first result
        result = results[0]
        detections = []
        boxes = result.boxes
        for box in boxes:
            # box.xyxy[0] gives [xmin, ymin, xmax, ymax]
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

if __name__ == '__main__':
    app.run(debug=True)