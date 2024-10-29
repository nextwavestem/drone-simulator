import '../css/appContainer.css'
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';


export const AppContainer = ({ children }) => {
    const getBannerReference = () => {
        if (window.location.hostname.includes('localhost')) {
          return '/assets/fixtures/nws_banner.png';
        }
      
        return '/drone-simulator/assets/fixtures/nws_banner.png';
      };

      const navigate = useNavigate();

      const handleLogoClick = () => {
          navigate('/');
      };
    
    return (
        <div className="application-container"> 
            <div className="header-container">
                <div className="nws-logo" onClick={handleLogoClick}>
                    <img src={getBannerReference()} alt="Logo" />
                </div>
            </div>
            <div className="application-content">
                { children }
            </div>
        </div>
    )
}

AppContainer.propTypes = {
    children: PropTypes.node,
};
