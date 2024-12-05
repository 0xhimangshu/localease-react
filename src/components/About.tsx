import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faClock, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

export const About = () => {
  return (
    <section className="py-5 bg-light" id="about">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <div className="glass-card p-4 h-100">
              <FontAwesomeIcon icon={faCheckCircle} className="fa-2x text-primary mb-3" />
              <h4>Verified Pros</h4>
              <p className="text-muted">All service providers are thoroughly vetted</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="glass-card p-4 h-100">
              <FontAwesomeIcon icon={faClock} className="fa-2x text-primary mb-3" />
              <h4>Quick Booking</h4>
              <p className="text-muted">Book services in minutes</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="glass-card p-4 h-100">
              <FontAwesomeIcon icon={faShieldAlt} className="fa-2x text-primary mb-3" />
              <h4>Secure Platform</h4>
              <p className="text-muted">Your safety is our priority</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};