import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

interface ErrorProps {
  customError?: {
    status: number;
    statusText: string;
    message: string;
  };
}

export function Error({ customError }: ErrorProps) {
  let statusCode = customError?.status || 404;
  let errorMessage = customError?.message || "Page not found";

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <img 
          src="https://cdni.iconscout.com/illustration/premium/thumb/error-404-4344461-3613889.png"
          alt="Error illustration"
          className="w-full max-w-2xl mx-auto mb-8"
        />

        <h1 className="text-4xl font-bold dark:text-white text-gray-900 mb-4">Oops!</h1>
        <p className="text-[50px] text-gray-600 mb-4">{statusCode} Error</p>
        <p className="text-xl text-gray-600 mb-8">{errorMessage}</p>

        <Link 
          to="/"
          className="inline-flex items-center gap-3 px-8 py-4 text-xl font-bold text-white bg-blue-800 rounded-full hover:from-pink-600 hover:to-violet-600"
        >
          <FontAwesomeIcon icon={faHome} className="text-2xl" />
          Return Home
        </Link>
      </div>
    </div>
  );
}
