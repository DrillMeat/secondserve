import React from "react";

const SupportUs = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
    <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
      This app is Built by 4 High Schoolers Passionate About Sustainability.
      <br />
      Your support helps us to save the planet.
    </h1>
    <a
      href="https://buy.stripe.com/test_14A3cuaBwaUb3142avdAk01"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-8 px-12 py-5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-2xl font-bold shadow"
    >
      Support us
    </a>
  </div>
);

export default SupportUs; 