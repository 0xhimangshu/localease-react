import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="py-4 bg-white">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4 text-center text-md-start">
            <h5 className="mb-3">LocalEase</h5>
            <p className="text-muted">Connecting you with trusted local services</p>
          </div>
          <div className="col-md-4 text-center">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-decoration-none text-muted">About Us</Link></li>
              <li><Link to="/services" className="text-decoration-none text-muted">Services</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-muted">Contact</Link></li>
            </ul>
          </div>
          <div className="col-md-4 text-center text-md-end">
            <h5 className="mb-3">Follow Us</h5>
            <div className="d-flex gap-3 justify-content-center justify-content-md-end">
              <a href="#" className="text-primary"><FontAwesomeIcon icon={faFacebook} className="fa-lg" /></a>
              <a href="#" className="text-primary"><FontAwesomeIcon icon={faTwitter} className="fa-lg" /></a>
              <a href="#" className="text-primary"><FontAwesomeIcon icon={faInstagram} className="fa-lg" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};