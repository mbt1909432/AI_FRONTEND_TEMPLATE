import React from 'react';
import Header from '../components/layout/Header';
import Hero from '../components/home/Hero';
import Templates from '../components/home/Templates';
import Footer from '../components/layout/Footer';

function LandingPage() {
  return (
    <>
      <Header />
      <Hero />
      <Templates />
      <Footer />
    </>
  );
}

export default LandingPage;

