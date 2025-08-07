import { useLocation, useNavigate } from 'react-router-dom'; // ✅ Add useLocation

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get passed state from navigation

  const { prediction, confidence } = location.state || {}; // ✅ destructure safely

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
          <p><strong>Prediction:</strong> {prediction}</p>
          <p><strong>Confidence:</strong> {confidence?.toFixed(2)}%</p>
        </div>
        <button className="back-btn" onClick={handleVerifyClick}>Verify Another</button>
      </div>
      <Footer />
    </>
  );
};

export default ResultPage;