
import React from 'react';
import Calendar from '../components/Calendar/Calendar';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen py-8 px-4 md:px-0">
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-center">Calendar View</h1>
      </header>
      
      <main>
        <Calendar />
      </main>
      
      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
        <p>Designed with precision and attention to detail</p>
      </footer>
    </div>
  );
};

export default Index;
