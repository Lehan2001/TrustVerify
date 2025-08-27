import React, { useState } from 'react';
import './App.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleVerifyClick = async () => {
    if (uploadedImages.length === 0) {
      alert("Please upload images first.");
      return;
    }

    const brand = document.getElementById("brandSelect").value.trim();
    const modelName = document.getElementById("modelInput").value.trim();

    if (!brand || !modelName) {
      alert("Please select brand and enter model name.");
      return;
    }

    const formData = new FormData();
    formData.append('brand', brand);
    formData.append('model', modelName);

    uploadedImages.forEach((imgObj, i) => {
      const file = imgObj.file;
      const renamedFile = new File([file], `upload_${i}.jpg`, { type: file.type });
      formData.append('images', renamedFile);
    });

    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        navigate('/result', { state: result });
      } else {
        alert("Prediction failed: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      alert("Something went wrong. Is the backend running?");
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const urls = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setUploadedImages(urls);
  };

  return (
    <>
      <Navbar />
      <div className="slideshow">
        <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} interval={3000}>
          <div><img src="/images/nike.png" alt="slide1" /></div>
          <div><img src="/images/adidas.png" alt="slide2" /></div>
          <div><img src="/images/nike1.png" alt="slide3" /></div>
          <div><img src="/images/adidas1.png" alt="slide4" /></div>
        </Carousel>
      </div>

      <h2>Check Product Authenticity</h2>

      <div className="image-upload">
        <label htmlFor="uploadInput">
          <img src="/images/upload.jpg" alt="upload" className="upload-image" />
        </label>
        <p className="upload-message">Please upload only Nike and Adidas shoe images for verification.</p>
        <input type="file" id="uploadInput" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageUpload} />

        {uploadedImages.length > 0 && (
          <div className="preview-gallery">
            <h3>Preview Uploaded Images:</h3>
            <div className="preview-container">
              {uploadedImages.map((img, index) => (
                <img key={index} src={img.preview} alt={`upload-${index}`} className="preview-image" />
              ))}
            </div>
          </div>
        )}
      </div>

      <label htmlFor="brandSelect">Select Brand</label>
      <select id="brandSelect" className="brand-select">
        <option value="">--Select Brand--</option>
        <option value="nike">Nike</option>
        <option value="adidas">Adidas</option>
      </select>

      <label htmlFor="modelInput">Enter Model Name</label>
      <input type="text" id="modelInput" className="model-input" placeholder="e.g. Air Force 1, Ultraboost" />

      <br />
      <button className="verify-btn" onClick={handleVerifyClick}>Verify</button>

      {loading && (
        <div className="loading-overlay">
        <div className="spinner"></div>
        <p>Processing images, please wait...</p>
        </div>
    )}

      <Footer />
    </>
  );
}

export default App;
