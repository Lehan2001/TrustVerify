import React from 'react';
import Navbar from './components/navbar';
import Footer from './components/footer';
import './result.css';
import { useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const navigate = useNavigate();

  // Mocked data (you can replace with props or fetched data)
  const prediction = 'Real';
  const confidence = 97.5;
  const shoeModel = 'Nike Air Max 90';
  const marketPrice = '$120';
  const gradcamImage = '/path-to-gradcam.jpg'; // optional
  const uploadedImage = '/path-to-uploaded.jpg'; // replace with actual image url

  const handleVerifyClick = () => {
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className="result-container">
        <h1>Verification Results</h1>
        <p1>Your shoe has been analyzed. Here are the details:</p1>
        <br></br>
        <br></br>
        <div className="image-section">
          <img src={uploadedImage} alt="Uploaded Shoe" className="uploaded-img" />
        </div>

        <div className="result-details">
          <p><strong>Prediction:</strong> {prediction}</p>
          <p><strong>Confidence:</strong> {confidence.toFixed(2)}%</p>
          <p><strong>Shoe Model:</strong> {shoeModel}</p>
          <p><strong>Official Price:</strong> {marketPrice}</p>
          {gradcamImage && (
            <div>
              <p><strong>Grad-CAM Visualization:</strong></p>
              <img src={gradcamImage} alt="Grad-CAM" className="gradcam-img" />
            </div>
          )}
        </div>

        <button className="back-btn" onClick={handleVerifyClick}>Verify Another</button>
      </div>

      <Footer/>
    </>
  );
};

export default ResultPage;
