from flask import Flask, request, jsonify
from PIL import Image
import torch
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load YOLOv5 model (first time will download weights)
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        print("No image uploaded")
        return jsonify({'error': 'No image uploaded'}), 400
    try:
        img_bytes = request.files['image'].read()
        img = Image.open(io.BytesIO(img_bytes))
        results = model(img)
        detections = results.pandas().xyxy[0].to_dict(orient="records")
        print("Detections:", detections)  # <-- Add this line
        return jsonify(detections)
    except Exception as e:
        print("Error:", e)  # <-- Add this line
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)