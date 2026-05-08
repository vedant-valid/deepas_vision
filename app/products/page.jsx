
// pages/products.js
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/navbar';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const gemstones = [
    {
      id: 201,
      name: 'RUBY ( माणिक )',
      category: 'gemstone',
      image: '/assets/ruby.png',
      description: 'Ruby is known for bringing passion, courage, and vitality.',
      zodiac: 'Leo',
      planet: 'Sun',
      benefits: ['Boosts confidence', 'Improves leadership', 'Increases vitality']
    },
    {
      id: 202,
      name: 'PEARL ( मोती )',
      category: 'gemstone',
      image: '/assets/pearl.png',
      description: 'Pearl symbolizes purity and emotional balance.',
      zodiac: 'Cancer',
      planet: 'Moon',
      benefits: ['Calms emotions', 'Enhances beauty', 'Supports intuition']
    },
    {
      id: 203,
      name: 'RED CORAL ( मूंगा )',
      category: 'gemstone',
      image: '/assets/red-coral.png',
      description: 'Red Coral brings strength, courage, and determination.',
      zodiac: 'Aries, Scorpio',
      planet: 'Mars',
      benefits: ['Improves physical strength', 'Overcomes fear', 'Enhances energy']
    },
    {
      id: 204,
      name: 'EMERALD ( पन्ना )',
      category: 'gemstone',
      image: '/assets/emerald.png',
      description: 'Emerald promotes intelligence, communication, and memory.',
      zodiac: 'Gemini, Virgo',
      planet: 'Mercury',
      benefits: ['Improves speech', 'Enhances memory', 'Brings clarity']
    },
    {
      id: 205,
      name: 'YELLOW SAPPHIRE ( पुखराज )',
      category: 'gemstone',
      image: '/assets/yellow-sapphire.png',
      description: 'Yellow Sapphire brings prosperity, wisdom, and good fortune.',
      zodiac: 'Sagittarius, Pisces',
      planet: 'Jupiter',
      benefits: ['Boosts financial growth', 'Enhances wisdom', 'Brings success']
    },
    {
      id: 206,
      name: 'OPAL ( ओपल )',
      category: 'gemstone',
      image: '/assets/opal.png',
      description: 'Opal enhances creativity, love, and emotional strength.',
      zodiac: 'Libra',
      planet: 'Venus',
      benefits: ['Increases imagination', 'Supports relationships', 'Boosts charm']
    },
    {
      id: 207,
      name: 'BLUE SAPPHIRE ( नीलम ) ',
      category: 'gemstone',
      image: '/assets/blue-sapphire.png',
      description: 'Blue Sapphire promotes discipline, focus, and structure.',
      zodiac: 'Capricorn, Aquarius',
      planet: 'Saturn',
      benefits: ['Enhances focus', 'Supports discipline', 'Protects from harm']
    },
    {
      id: 208,
      name: 'Hessonite ( गोमेद )',
      category: 'gemstone',
      image: '/assets/hessonite.png',
      description: 'Hessonite provides clarity, fame, and protection from enemies.',
      zodiac: 'Aquarius',
      planet: 'Rahu',
      benefits: ['Removes fear', 'Improves focus', 'Enhances fame']
    },
    {
      id: 209,
      name: 'CAT’s EYE ( लहसुनिया )',
      category: 'gemstone',
      image: '/assets/cat.png',
      description: 'Cat\'s Eye protects against the evil eye and boosts intuition.',
      zodiac: 'Pisces',
      planet: 'Ketu',
      benefits: ['Enhances psychic ability', 'Protects from negativity', 'Boosts spiritual growth']
    },
  ];
  
  const energyProducts = [
    {
      id: 101,
      name: 'Spiritual Mala',
      category: 'energy',
      image: '/assets/mala.png',
      description: 'A powerful mala infused with mantras for protection and focus.'
    },
    {
      id: 102,
      name: 'Spiritual Box',
      category: 'energy',
      image: '/assets/bracelets.png',
      description: 'Curated box of items for meditation and rituals.'
    },
    {
      id: 103,
      name: 'Potli for Prosperity',
      category: 'energy',
      image: '/assets/redbag.png',
      description: 'Traditional red potli with herbs for wealth and success.'
    },
    {
      id: 104,
      name: 'Yellow Potli',
      category: 'energy',
      image: '/assets/yellowpotli.png',
      description: 'Energy-charged potli to balance solar energies.'
    },
    {
      id: 105,
      name: 'Energy Oils',
      category: 'energy',
      image: '/assets/oils.png',
      description: 'Aromatherapy oils for healing and relaxation.'
    },
    {
      id: 106,
      name: 'Shivlings',
      category: 'energy',
      image: '/assets/shivlings.png',
      description: 'Divine representation of Lord Shiva for devotion.'
    },
    {
      id: 107,
      name: 'Pyramids',
      category: 'energy',
      image: '/assets/pyramids.png',
      description: 'Energy pyramids for Vastu correction and aura cleansing.'
    },
    {
      id: 108,
      name: 'Tabeez (Amulet)',
      category: 'energy',
      image: '/assets/tabeez.png',
      description: 'Worn for spiritual protection and blessings.'
    },
    {
      id: 109,
      name: 'Silver Yantra',
      category: 'energy',
      image: '/assets/silveryantra.png',
      description: 'Sacred geometry for manifestation and energy channeling.'
    },
    {
      id: 110,
      name: 'Spiritual Box',
      category: 'energy',
      image: '/assets/box.png',
      description: 'Curated box of items for meditation and rituals.'
    },
    {
      id: 111,
      name: 'Spiritual Box',
      category: 'energy',
      image: '/assets/squareyantra.png',
      description: 'Curated box of items for meditation and rituals.'
    },
    {
      id: 112,
      name: 'Spiritual Box',
      category: 'energy',
      image: '/assets/gada.png',
      description: 'Curated box of items for meditation and rituals.'
    },
  ];

  const categories = ['All', 'Energy products', 'The gemstones'];

  const filteredProducts =
    selectedCategory === 'All'
      ? [...gemstones, ...energyProducts]
      : selectedCategory === 'Energy products'
      ? energyProducts
      : gemstones;

  const openModal = (product) => {
    setSelectedProduct(product);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-red-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-red-800 border-t-transparent rounded-full"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-red-800 rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50">
      <Navbar />
  
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-800 to-red-900 text-white py-20 px-4 text-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-1/4 w-4 h-4 bg-white rounded-full animate-twinkle"></div>
          <div className="absolute top-20 right-1/3 w-3 h-3 bg-white rounded-full animate-twinkle-delay"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white rounded-full animate-twinkle"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif tracking-tight">
          Energy  <span className="text-red-200">products</span>
          </h1>
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 font-serif tracking-normal text--800">
  How they help?
</h2>

          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
          Astrology is नॉट a business — we agree on that. But sometimes, due to the influence of certain planets ऐंड situations, Mantra Jaap becomes a powerful and the only option. That is why, based on your dashas, yearly predictions, and charts, we offer you these abhimantrit offerings, charged with the energy of वैदिक mantras, as per the requirements.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-8 inline-block">
            <button className="bg-white hover:bg-red-50 text-red-800 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
              Discover Your Birthstone
            </button>
          </motion.div>
        </motion.div>
      </div>
  
      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-12 space-x-2 md:space-x-4"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full capitalize font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-red-800 text-white shadow-md'
                  : 'bg-white text-red-800 hover:bg-red-50 border border-red-200 shadow-sm'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-red-100 relative group cursor-pointer"
              onClick={() => openModal(product)}
            >
              <div className="h-96 bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }}></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-red-800 mb-2">{product.name}</h3>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{product.description}</p>
                {product.zodiac && <div className="text-sm text-gray-600">Zodiac: {product.zodiac}</div>}
                {product.planet && <div className="text-sm text-gray-600">Planet: {product.planet}</div>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl overflow-y-auto max-w-xl w-full max-h-[80vh] p-6 shadow-xl relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-xl font-bold"
              >
                &times;
              </button>
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-64 object-cover rounded-lg mb-4" />
              <h2 className="text-2xl font-semibold text-red-800 mb-2">{selectedProduct.name}</h2>
              <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
              <div className="text-sm text-red-700 font-medium mb-2">📞 Contact us for pricing</div>
              {selectedProduct.zodiac && <div className="text-sm text-gray-600">Zodiac: {selectedProduct.zodiac}</div>}
              {selectedProduct.planet && <div className="text-sm text-gray-600 mb-2">Planet: {selectedProduct.planet}</div>}
              {selectedProduct.benefits && (
                <ul className="text-gray-700 list-disc list-inside mt-2">
                  {selectedProduct.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
