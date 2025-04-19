import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";

const FourFrameApp = () => {
  const webcamRef = useRef(null);
  const [images, setImages] = useState([]);
  const [delay, setDelay] = useState(3);
  const [borderColor, setBorderColor] = useState("#000");

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImages((prev) => [...prev, imageSrc]);
    }
  };

  const startCapture = async () => {
    setImages([]);
    for (let i = 0; i < 4; i++) {
      await new Promise((res) => setTimeout(res, delay * 1000));
      captureImage();
    }
  };

  const downloadImage = async () => {
    const element = document.getElementById("result");
    if (element) {
      const canvas = await html2canvas(element);
      const link = document.createElement("a");
      link.download = "four-frame.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="app" style={{ textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>人生四格拍照</h1>
      <div style={{ marginBottom: 10 }}>
        <label>边框颜色：</label>
        <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} />
        <label style={{ marginLeft: 10 }}>延时（秒）：</label>
        <input type="number" min="1" max="10" value={delay} onChange={(e) => setDelay(Number(e.target.value))} />
        <button onClick={startCapture} style={{ marginLeft: 10 }}>开始拍摄</button>
      </div>

      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: 320, height: 240, borderRadius: 8 }} />

      {images.length === 4 && (
        <div style={{ marginTop: 20 }}>
          <h3>四格图</h3>
          <div
            id="result"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 150px)",
              gridGap: "10px",
              justifyContent: "center",
              padding: 10,
              border: `5px solid ${borderColor}`,
              width: "max-content",
              margin: "auto"
            }}
          >
            {images.map((img, i) => (
              <img key={i} src={img} alt={`snap-${i}`} width={150} height={110} style={{ borderRadius: 4 }} />
            ))}
          </div>
          <button onClick={downloadImage} style={{ marginTop: 10 }}>下载四格图</button>
        </div>
      )}
    </div>
  );
};

export default FourFrameApp;
