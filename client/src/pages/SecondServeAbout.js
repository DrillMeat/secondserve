import React from 'react';
import Footer from '../components/layout/Footer';
import BoardOfCreators from '../components/layout/BoardOfCreators';

const SecondServeAbout = () => {
  return (
    <div className="min-h-screen bg-[#f9f6f4] flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-16 px-4 text-center bg-[#f9f6f4]">
        <h2 className="text-pink-600 font-bold text-lg mb-2 tracking-widest">ABOUT US</h2>
        <h1 className="text-4xl md:text-6xl font-extrabold text-green-900 mb-4 leading-tight">
          FIGHTING FOOD WASTE<br />TOGETHER SINCE 2025
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
          SecondServe is an AI powered food discount generator that gives people a sustainable way to shop and gives stores a way to combat food waste. We believe that there's something more to be done with the 133 Million pounds of food thrown away.
        </p>
        <div className="flex justify-center">
          <img src="/seco4.png" alt="SecondServe Hero" className="w-[400px] h-[250px] object-cover rounded-lg shadow-lg" />
        </div>
      </section>

      {/* Dream Section */}
      <section className="w-full py-16 px-4 bg-green-900 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-2">WE DREAM OF A PLANET WITH</h2>
            <span className="text-yellow-200 text-4xl md:text-5xl font-extrabold">no food waste</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <h3 className="text-5xl font-extrabold">400+</h3>
              <p className="uppercase text-sm font-semibold mb-2">Meals Saved</p>
              <p className="text-white/80 text-sm">We save food from going to waste, through SecondServe Platform.</p>
            </div>
            <div>
              <h3 className="text-5xl font-extrabold">100+</h3>
              <p className="uppercase text-sm font-semibold mb-2">Registered Users</p>
              <p className="text-white/80 text-sm">Using the SecondServe app around the world.</p>
            </div>
            <div>
              <h3 className="text-5xl font-extrabold">20+</h3>
              <p className="uppercase text-sm font-semibold mb-2">Business Partners</p>
              <p className="text-white/80 text-sm">Actively helping to save good food from going to waste.</p>
            </div>
          </div>
          <div className="mt-8">
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <button className="bg-white text-green-900 font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-100 transition">DOWNLOAD THE APP</button>
            </a>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="w-full py-16 px-4 bg-[#f9f6f4]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="w-80 h-80 rounded-full flex items-center justify-center shadow" style={{ backgroundColor: '#f9f6f4' }}>
              <img src="/seco4.png" alt="SecondServe History" className="w-72 h-72 object-cover rounded-full" />
            </div>
          </div>
          <div>
            <span className="text-pink-600 font-bold uppercase tracking-widest">Discover</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-4 mt-2">OUR HISTORY</h2>
            <p className="text-gray-700 mb-4">
              SecondServe was founded in 2025 by the group of LaunchX students to fight food waste. We found a way to combat waste of food and at the same time generate additional profit for food stores.
            </p>
            <button className="mt-2 bg-green-900 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-green-800 transition">READ MORE</button>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="w-full py-16 px-4 bg-[#f9f6f4]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-pink-600 font-bold uppercase tracking-widest">Positive Impact</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-4 mt-2">AROUND THE WORLD</h2>
            <p className="text-gray-700 mb-4">
              We are currently working on expansion worldwide, but right now you can find us in USA, mostly in Boston!
            </p>
            <button className="mt-2 bg-green-900 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-green-800 transition">Locations</button>
          </div>
          <div className="flex justify-center">
            <iframe
              title="SecondServe Boston Locations"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.393857964839!2d-71.1203386845437!3d42.3504999791866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e379b7b7b7b7b7%3A0x7b8b8b8b8b8b8b8b!2sBoston%20University!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
              width="400"
              height="250"
              style={{ border: 0, borderRadius: '0.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <BoardOfCreators />
      <Footer />
    </div>
  );
};

export default SecondServeAbout; 