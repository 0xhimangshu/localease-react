import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCar, faLaptop } from '@fortawesome/free-solid-svg-icons';

export const Services = () => {
  return (
    <section className="py-5" id="services">
      <div className="container">
        <h2 className="text-center mb-5">Our Services</h2>
        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <div className="glass-card p-4 h-100">
              <div className="service-icon mb-4">
                <FontAwesomeIcon icon={faHome} className="fa-2x" />
              </div>
              <h4>Home Services</h4>
              <p className="text-muted">Professional home maintenance & repairs</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="glass-card p-4 h-100">
              <div className="service-icon mb-4">
                <FontAwesomeIcon icon={faCar} className="fa-2x" />
              </div>
              <h4>Auto Services</h4>
              <p className="text-muted">Expert vehicle care & maintenance</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="glass-card p-4 h-100">
              <div className="service-icon mb-4">
                <FontAwesomeIcon icon={faLaptop} className="fa-2x" />
              </div>
              <h4>Tech Support</h4>
              <p className="text-muted">Professional tech assistance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};