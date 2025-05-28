import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { HomePage } from './pages/home-page';
import { Button } from '@/components/ui/button';

function App() {
  return (
    <BrowserRouter>
      <div className="container mx-auto p-4">
        <header className="mb-8">
          <nav className="flex items-center justify-between p-4 bg-background border-b">
            <Link to="/" className="text-2xl font-bold text-primary">
              StrapiVite
            </Link>
            <div className="space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/">Home</Link>
              </Button>
              <Button variant="ghost" asChild>
                <a href="http://localhost:1337/admin" target="_blank" rel="noopener noreferrer">Admin Panel</a>
              </Button>
            </div>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add other routes as needed */}
          </Routes>
        </main>
        <footer className="mt-12 py-8 text-center text-muted-foreground border-t">
          <p>&copy; {new Date().getFullYear()} StrapiVite Template. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
