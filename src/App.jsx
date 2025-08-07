import React, { useState } from 'react';
import './App.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';



function App() {

  const navigate = useNavigate();

  const handleVerifyClick = async () => {
  if (uploadedImages.length === 0) {
    alert("Please upload images first.");
    return;
  }

  const formData = new FormData();
  uploadedImages.forEach((imgObj, i) => {
  const renamedFile = new File([imgObj.file], `upload_${i}.jpg`, { type: imgObj.file.type });
  formData.append('images', renamedFile); // ✅ renamed files
  });



  try {
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      alert(`Prediction: ${result.prediction} (${result.confidence.toFixed(2)}%)`);
      navigate('/result', { state: result }); // optional: pass results to result page
    } else {
      alert("Prediction failed: " + result.error);
    }

  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Backend might be down.");
  }
};


  const [uploadedImages, setUploadedImages] = useState([]);

  const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
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
        <Carousel
          autoPlay
          infiniteLoop
          showThumb={false}
          showStatus={false}
          interval={3000}
        >
        <div>
          <img src="/images/nike.png" alt="slide1"/>
        </div>
        <div>
          <img src="/images/adidas.png" alt="slide2"/>
        </div>
        <div>
          <img src="/images/nike1.png" alt="slide3"/>
        </div>
        <div>
          <img src="/images/adidas1.png" alt="slide4"/>
        </div>
          
        </Carousel>
      </div>
      <br/>
      <br/>
      <h2>Check Product Authenticity</h2>
      <br/><br/>
      <div className="image-upload">
        <label htmlFor="uploadInput">
          <img src="/images/upload.jpg" alt="upload" className="upload-image"/>
        </label>
        
        <p1 className="upload-message"> Please upload only Nike and Adidas shoe images for verification.</p1>
       
        <br></br>
        <input 
          type="file"
          id="uploadInput"
          accept="image/*"
          multiple
          style={{ display: 'none' }}   
          onChange={handleImageUpload}
        />

        {uploadedImages.length > 0 && (
  <div className="preview-gallery">
    <h3>Preview Uploaded Images:</h3>
    <div className="preview-container">
      {uploadedImages.map((img, index) => (
        <img
          key={index}
          src={img.preview}
          alt={`upload-${index}`}
          className="preview-image"
        />
      ))}
    </div>
  </div>
)}


        
      </div>
      <br/>

      <label htmlFor="brandSelect"> Select Brand  </label>
      <select id="brandSelect" className="brand-select">
        <option value="">--Select Brand--</option>
        <option value="nike">Nike</option>
        <option value="adidas">Adidas</option>
      </select>
      <br/>
      <br/>
      <label htmlFor="modelInput">Enter Model Name </label>
      <input
      type="text"
      id="modelInput"
      className="model-input"
      placeholder="e.g. Air Force1, Ultraboost"
      />
      <br/>
      <br/>
      <br/>
      <br/>
      <button className="verify-btn" onClick={handleVerifyClick}>Verify</button>

      <br/>
      <br/>
      <br/>
      <br/>
      <Footer/>
    </>   
  );
}

export default App;