import React from 'react';

const creators = [
  {
    name: 'Tim',
    title: 'Website Creator (CEO) (Boss)',
    img: '/Tim.png',
    desc: ''
  },
  {
    name: 'Harry',
    title: 'AI Scanning Feature Developer and Daddy (CTO)',
    img: '/Harry.png',
    desc: ''
  },
  {
    name: 'Jared',
    title: 'Marketing Developing Executive (MCO)',
    img: '/Jared.png',
    desc: ''
  },
  {
    name: 'Chun',
    title: 'Communication Developing Executive (CCO)',
    img: '/placeholder4.png',
    desc: ''
  }
];

const BoardOfCreators = () => (
  <section className="py-16 bg-[#f9f6f4]">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-10 text-center">Board of Creators</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {creators.map((c, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
            <img src={c.img} alt={c.name} className="w-32 h-32 object-cover rounded-full mb-4 bg-gray-200" />
            <h3 className="text-xl font-bold text-green-900 mb-1">{c.name}</h3>
            <p className="text-green-700 font-semibold mb-2">{c.title}</p>
            <p className="text-gray-600 text-sm">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BoardOfCreators; 