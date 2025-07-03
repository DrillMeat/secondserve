import React from 'react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-[#f9f6f4] flex flex-col items-center justify-center py-4 px-4">
      <h1 className="text-5xl md:text-6xl font-extrabold text-green-900 mb-2 tracking-widest">CONTACT US</h1>
      <div className="text-gray-500 italic text-lg mb-8 text-center w-full">we love you</div>
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Contact Info */}
        <div>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-green-900 mb-4 tracking-wider uppercase text-center md:text-left">Provider of the website:</h2>
            <div className="text-gray-700 text-lg text-center md:text-left">
              <div className="mb-2">Tim</div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-900 mb-4 tracking-wider uppercase text-center md:text-left">Contact us:</h2>
            <div className="text-gray-700 text-lg text-center md:text-left">
              <div className="mb-2">+1 305 904 2623</div>
              <div className="mb-2">575 Commonwealth Ave, Boston</div>
              <div className="mb-2">secondserve16@launchx.com</div>
            </div>
          </div>
        </div>
        {/* Right: Map */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-bold text-green-900 mb-4 tracking-wider uppercase text-center md:text-left">OFFICE</h2>
          <iframe
            title="SecondServe Boston Address"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.646393964839!2d-71.1043386845437!3d42.3494999791866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e379e6b7b7b7b7%3A0x7b8b8b8b8b8b8b8b!2s575%20Commonwealth%20Ave%2C%20Boston%2C%20MA%2002215!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: '0.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 