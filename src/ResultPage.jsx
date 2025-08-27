import { useLocation, useNavigate } from 'react-router-dom'; // ✅ Add useLocation
import Navbar from './components/navbar';
import Footer from './components/footer';
import './result.css';

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get passed state from navigation
  

  const { prediction, confidence, brand, model, price } = location.state || {}; // ✅ destructure safely

  const handleVerifyClick = () => {
    navigate('/');
  };

  
  

  return (
    <>
      <Navbar />
      <div className="result-container">
        <h1>Verification Results</h1>
        <p1>Your shoe has been analyzed. Here are the details:</p1>
        <br /><br />
        
        <div className="result-details">
          <p><strong>Brand:</strong> {brand}</p>
          <p><strong>Model:</strong> {model}</p>
          <p><strong>Prediction:</strong> {prediction}</p>
          <p><strong>Confidence:</strong> {confidence?.toFixed(2)}%</p>
          <p><strong>Market Price:</strong> {price}</p>
        </div>
        <button className="back-btn" onClick={handleVerifyClick}>Verify Another</button>
      </div>
      <Footer />
    </>
  );
};

export default ResultPage;