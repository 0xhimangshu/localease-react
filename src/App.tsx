import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Navbar } from './components/Navbar';
import { ThemeToggle } from './components/ThemeToggle';


export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <div className="wave-bg"></div>
        <Navbar />
        <main className="flex-grow relative pt-[74px]">
          <AppRoutes />
        </main>
        <ThemeToggle />
      </div>
    </BrowserRouter>
  );
}

export default App;