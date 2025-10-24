import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Templates from './components/Templates';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Templates />
      <Footer />
    </div>
  );
}

export default App;

