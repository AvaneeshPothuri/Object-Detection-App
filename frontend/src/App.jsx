import React, { useState, useRef } from "react";

const classColors = {
  person: "#FF5733",
  tv: "#33C1FF",
  car: "#33FF57",
  // Add more classes and colors as needed
};

const MAX_WIDTH = 500;

function App() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgDims, setImgDims] = useState({ width: 0, height: 0 });
  const canvasRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
      setDetections([]);
      setImgDims({ width: 0, height: 0 });
    }
  };

  React.useEffect(() => {
    if (!imageUrl) return;
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      setImgDims({ width: img.width, height: img.height });
    };
  }, [imageUrl]);

  const drawBoxes = () => {
    if (!imageUrl || imgDims.width === 0 || detections.length === 0) return;
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = canvasRef.current;
      const containerWidth = Math.min(window.innerWidth * 0.95, MAX_WIDTH);
      const scale = containerWidth / img.width;
      const displayHeight = img.height * scale;
      canvas.width = containerWidth;
      canvas.height = displayHeight;
      const ctx = canvas.getContext("2d");
      // Fill canvas with white to avoid black bars
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, containerWidth, displayHeight);

      detections.forEach((det) => {
        if (det.confidence < 0.5) return;
        const color = classColors[det.name] || "#FF00FF";
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        const xmin = det.xmin * scale;
        const ymin = det.ymin * scale;
        const boxWidth = (det.xmax - det.xmin) * scale;
        const boxHeight = (det.ymax - det.ymin) * scale;
        ctx.strokeRect(xmin, ymin, boxWidth, boxHeight);
        ctx.font = "16px Arial";
        const text = `${det.name} (${(det.confidence * 100).toFixed(1)}%)`;
        const textWidth = ctx.measureText(text).width;
        const textHeight = 20;
        ctx.fillStyle = color;
        ctx.fillRect(xmin, ymin - textHeight, textWidth + 8, textHeight);
        ctx.fillStyle = "white";
        ctx.fillText(text, xmin + 4, ymin - 5);
      });
    };
  };

  React.useEffect(() => {
    if (detections.length > 0) {
      drawBoxes();
    }
    // eslint-disable-next-line
  }, [detections, imageUrl, imgDims]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        fontFamily: "sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "32px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "#333", textAlign: "center" }}>Object Detection App</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: "100%",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              padding: "8px",
              borderRadius: 4,
              border: "1px solid #ccc",
              width: "100%",
              maxWidth: 350,
              background: "#fff",
            }}
          />
          <button
            onClick={async () => {
              if (!image) return;
              setLoading(true);
              const formData = new FormData();
              formData.append("image", image);

              try {
                const response = await fetch("http://localhost:5000/detect", {
                  method: "POST",
                  body: formData,
                });
                const data = await response.json();
                setDetections(data);
              } catch (error) {
                alert("Error detecting objects.");
              }
              setLoading(false);
            }}
            disabled={!image || loading}
            style={{
              padding: "10px 28px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 16,
              cursor: !image || loading ? "not-allowed" : "pointer",
              width: "100%",
              maxWidth: 180,
              margin: "0 auto",
            }}
          >
            {loading ? "Detecting..." : "Detect Objects"}
          </button>
        </div>
        <div
          style={{
            width: "100%",
            maxWidth: MAX_WIDTH,
            minHeight: 200,
            background: "#fff",
            borderRadius: 8,
            border: "2px dashed #bbb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {imageUrl && detections.length === 0 ? (
            <img
              src={imageUrl}
              alt="preview"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 8,
                display: "block",
                maxWidth: MAX_WIDTH,
                background: "#fff",
              }}
            />
          ) : detections.length > 0 ? (
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 8,
                background: "#fff",
                display: "block",
                maxWidth: MAX_WIDTH,
              }}
            />
          ) : (
            <span style={{ color: "#888", fontSize: 18, textAlign: "center" }}>
              Image preview will appear here
            </span>
          )}
        </div>
        {detections.length > 0 && (
          <div style={{ marginTop: 24, width: "100%", maxWidth: MAX_WIDTH }}>
            <h3>Detections:</h3>
            <ul style={{ paddingLeft: 18 }}>
              {detections
                .filter((det) => det.confidence >= 0.5)
                .map((det, idx) => (
                  <li key={idx} style={{ color: classColors[det.name] || "#FF00FF", fontSize: 16 }}>
                    {det.name} ({(det.confidence * 100).toFixed(1)}%)
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
      <div style={{ height: 32 }} />
    </div>
  );
}

export default App;