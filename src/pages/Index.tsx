
import React from 'react';
import Calendar from '../components/Calendar/Calendar';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen px-4 md:px-0">
      <main>
        <Calendar />
      </main>

      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
        <p><a href="https://www.eferro.net" target="_blank" rel="noopener noreferrer">Made with ❤️ by eferro</a></p>
      </footer>
    </div>
  );
};

export default Index;
