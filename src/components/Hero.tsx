import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

export const Hero = () => {
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
      });
    }
  };

  return (
    <section className="py-5 mt-5">
      <div className="container py-lg-5">
        <div className="row align-items-center">
          <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
            <h1 className="display-4 fw-bold mb-4">
              Find Local Services<br />
              <span className="text-primary">You Can Trust</span>
            </h1>
            <p className="lead mb-5">
              Connect with verified professionals in your area for all your service needs
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
              <button className="btn btn-primary w-70 w-sm-auto rounded-full" onClick={requestLocationPermission}>
                Find Services Nearby
                <FontAwesomeIcon icon={faLocationDot} className="ms-2" />
              </button>
              <button className="btn btn-outline w-90 w-sm-auto rounded-full">
                Learn More
              </button>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-center align-items-center">
            <img 
              src="https://cdni.iconscout.com/illustration/premium/thumb/repair-and-maintenance-symbols-illustration-download-in-svg-png-gif-file-formats--tool-wrench-service-business-technology-pack-illustrations-10397369.png" 
              alt="hero" 
              className="img-fluid"
              style={{maxWidth: '80%', height: 'auto'}}
            />
          </div>
        </div>
      </div>
    </section>
  );
};