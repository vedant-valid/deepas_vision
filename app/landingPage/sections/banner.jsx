import React from 'react';

const CelestialBanner = () => {
  return (
    <div className="relative w-full bg-gray-900 flex px-8 py-10 overflow-hidden">
   
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 border border-gray-700 rounded-full scale-150"></div>
        <div className="absolute inset-0 border border-gray-700 rounded-full scale-125 translate-x-1/4"></div>
        <div className="absolute inset-0 border border-gray-700 rounded-full scale-100 -translate-x-1/4"></div>
      </div>
      
    
      <div className="absolute inset-0">
        <div className="absolute top-6 left-40 text-yellow-400 opacity-40 text-lg">★</div>
        <div className="absolute top-10 left-80 text-yellow-400 opacity-30 text-sm">✧</div>
        <div className="absolute bottom-8 left-64 text-yellow-400 opacity-40 text-xs">✦</div>
        <div className="absolute top-1/3 right-12 text-yellow-400 opacity-30 text-xl">★</div>
        <div className="absolute bottom-12 right-36 text-yellow-400 opacity-40 text-lg">✧</div>
        <div className="absolute top-20 right-1/4 text-yellow-400 opacity-30 text-2xl">★</div>
      </div>
      
   
      <div className="flex justify-between items-center w-full">
      
        <div className="w-64 h-64 relative flex-shrink-0">
     
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20">
            <div className="w-full h-full bg-yellow-100 rounded-full opacity-90"></div>
          </div>
          
      
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
            {[...Array(16)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-px h-12 bg-yellow-200"
                style={{ 
                  left: '50%',
                  top: '50%',
                  transformOrigin: 'center',
                  transform: `rotate(${i * 22.5}deg) translateY(-30px)`,
                  opacity: i % 2 === 0 ? 1 : 0.6,
                  height: i % 2 === 0 ? '48px' : '32px'
                }}
              ></div>
            ))}
            
             {[...Array(10)].map((_, i) => (
              <div 
                key={`dot-${i}`} 
                className="absolute w-1 h-1 bg-yellow-200 rounded-full"
                style={{ 
                  left: '50%',
                  top: '50%',
                  transformOrigin: 'center',
                  transform: `rotate(${i * 36}deg) translateY(-24px)` 
                }}
              ></div>
            ))}
          </div>
          
           <div className="absolute top-10 left-12 text-yellow-400 transform rotate-12">
            <span className="text-lg"></span>
          </div>
          <div className="absolute bottom-20 left-20 text-yellow-400 transform -rotate-12">
            <span className="text-sm">✧</span>
          </div>
        </div>

         <div className="flex flex-col items-start max-w-md pl-6">
          <h2 className="text-4xl text-white font-serif font-bold mb-2">
            Get an answer to one question for free
          </h2>
          <p className="text-gray-300 text-sm mb-6">
            Your path is illuminated by a road-map of stars. I am here to guide you!
          </p>
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-8 rounded">
            Get started
          </button>
        </div>
      </div>
      
       <div className="absolute -right-24 -bottom-24 text-yellow-300 opacity-10">
        <div className="w-64 h-64 rounded-full border-2 border-yellow-200"></div>
      </div>
    </div>
  );
};

export default CelestialBanner;