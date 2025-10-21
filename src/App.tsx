'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Heart, Gift, Users, Sparkles, Cake } from 'lucide-react';
import React from 'react';

// --- Type Definitions ---

interface Confetti {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
}

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
}

// --- Constants ---

const TOTAL_CANDLES = 6;
const CONFETTI_COLORS = ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#3B82F6', '#EF4444', '#F97316'];
const CONFETTI_COUNT = 80;
const ANIMATION_FRAME_RATE = 16; // ~60fps
const CONFETTI_DURATION_MS = 5000;

// --- Main Component ---

const App = () => {
  const [candlesBlown, setCandlesBlown] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [wishes, setWishes] = useState<string[]>([
    "May your day be filled with happiness and joy! 🌟",
    "Wishing you all the best on your special day! 🎂",
    "Hope this year brings you endless smiles! 😊"
  ]);
  const [newWish, setNewWish] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  // 1. Initialize floating elements
  useEffect(() => {
    const elements: FloatingElement[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setFloatingElements(elements);

    // Initial window dimensions for confetti setup safety
    if (typeof window !== 'undefined') {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  // 2. Clock Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Confetti Animation Logic
  useEffect(() => {
    if (!showConfetti || windowDimensions.width === 0) return;

    const initialConfetti: Confetti[] = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      // Use windowDimensions for safe initial positioning
      x: Math.random() * windowDimensions.width, 
      y: -10,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 8 + 4,
      speedX: (Math.random() - 0.5) * 4,
      speedY: Math.random() * 3 + 2,
    }));
    setConfetti(initialConfetti);

    const animateConfetti = () => {
      setConfetti(prev => 
        prev.map(piece => ({
          ...piece,
          x: piece.x + piece.speedX,
          y: piece.y + piece.speedY,
          speedY: piece.speedY + 0.08,
        }))
        // Filter using the actual window height state
        .filter(piece => piece.y < windowDimensions.height + 50) 
      );
    };

    const interval = setInterval(animateConfetti, ANIMATION_FRAME_RATE);
    
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setShowConfetti(false);
      // Optional: keep last few pieces for a smoother fade, or clear completely
      setConfetti([]); 
    }, CONFETTI_DURATION_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  // IMPORTANT: Added windowDimensions to dependency array as its values are used inside the effect
  }, [showConfetti, windowDimensions.width, windowDimensions.height]); 

  // --- Handlers ---

  const blowCandle = useCallback(() => {
    setCandlesBlown(prev => {
      const nextCandlesBlown = prev + 1;
      if (nextCandlesBlown <= TOTAL_CANDLES) {
        if (nextCandlesBlown === TOTAL_CANDLES) {
          setShowConfetti(true);
        }
        return nextCandlesBlown;
      }
      return prev;
    });
  }, []); // dependencies are fine here

  const addWish = useCallback(() => {
    if (newWish.trim()) {
      // Corrected "Haram" placeholder text in the wish input to match the page name "Aiman"
      const wishText = newWish.trim().replace('Haram', 'Aiman'); 
      setWishes(prev => [...prev, wishText]);
      setNewWish('');
    }
  }, [newWish]);

  const resetCake = useCallback(() => {
    setCandlesBlown(0);
  }, []);

  // --- Rendered Component ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute opacity-20"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animation: `float ${element.speed}s ease-in-out infinite`,
              animationDelay: `${element.delay}s`,
            }}
          >
            <div className="relative">
              <Heart 
                className="text-pink-400 animate-pulse" 
                size={element.size} 
                style={{ animationDuration: `${2 + Math.random()}s` }}
              />
            </div>
          </div>
        ))}
        
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <Sparkles className="text-yellow-400" size={6 + Math.random() * 8} />
          </div>
        ))}
      </div>

      {/* Confetti */}
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="absolute rounded-full pointer-events-none shadow-sm"
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            transform: `rotate(${piece.x * 0.2}deg)`,
            boxShadow: `0 0 ${piece.size}px ${piece.color}40`,
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-6 animate-pulse">
              Happy Birthday
            </h1>
            <div className="absolute -top-4 -right-4 animate-bounce">
              <div className="text-4xl">🎉</div>
            </div>
            <div className="absolute -top-2 -left-6 animate-bounce" style={{ animationDelay: '0.5s' }}>
              <div className="text-3xl">✨</div>
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text mb-8 animate-pulse" style={{ animationDelay: '0.3s' }}>
            Aiman! 💖
          </h2>
          <div className="text-lg text-gray-600 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 inline-block shadow-lg border border-white/40">
            {currentTime.toLocaleString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit', 
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Beautiful Birthday Cake Section */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                <Cake className="text-pink-500 animate-bounce" />
                Make a Wish!
                <Sparkles className="text-yellow-500 animate-pulse" />
              </h2>
              <p className="text-gray-600 text-lg">Click the candles to blow them out one by one</p>
            </div>
            
            {/* Enhanced Cake - Fixed typo mt- to mt-8 */}
            <div className="relative flex justify-center mt-8"> 
              {/* Cake Base with Layers */}
              <div className="relative">
                {/* Bottom Layer */}
                <div className="w-80 h-24 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 rounded-2xl shadow-xl relative">
                  <div className="absolute inset-2 bg-gradient-to-b from-pink-200 to-pink-300 rounded-xl"></div>
                  <div className="absolute inset-4 bg-gradient-to-b from-purple-200 to-purple-300 rounded-lg"></div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-2xl">
                    🌸 💖 🌸 💖 🌸
                  </div>
                </div>
                
                {/* Middle Layer */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-64 h-20 bg-gradient-to-b from-rose-200 via-rose-300 to-rose-400 rounded-2xl shadow-lg">
                  <div className="absolute inset-2 bg-gradient-to-b from-pink-100 to-pink-200 rounded-xl"></div>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xl">
                    🎀 ✨ 🎀
                  </div>
                </div>
                
                {/* Top Layer */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-48 h-16 bg-gradient-to-b from-purple-200 via-purple-300 to-purple-400 rounded-2xl shadow-lg">
                  <div className="absolute inset-2 bg-gradient-to-b from-pink-50 to-pink-100 rounded-xl"></div>
                </div>

                {/* Beautiful Candles */}
                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 flex gap-4">
                  {Array.from({ length: TOTAL_CANDLES }).map((_, i) => (
                    <div key={i} className="relative group">
                      {/* Candle Stick */}
                      <div className="w-3 h-10 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-t-lg shadow-md relative">
                        <div className="absolute inset-x-0 top-0 h-1 bg-yellow-400 rounded-t-lg"></div>
                      </div>
                      
                      {/* Flame with Animation */}
                      {candlesBlown <= i && (
                        <div 
                          className="absolute -top-4 left-1/2 transform -translate-x-1/2 cursor-pointer group-hover:scale-125 transition-all duration-300"
                          onClick={blowCandle}
                        >
                          <div className="relative">
                            {/* Flame */}
                            <div className="w-4 h-6 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full animate-pulse shadow-lg">
                              <div className="absolute inset-0 bg-gradient-to-t from-red-400 via-orange-300 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            {/* Glow Effect */}
                            <div className="absolute inset-0 w-4 h-6 bg-yellow-300 rounded-full blur-sm opacity-60 animate-pulse"></div>
                            {/* Wax Drip */}
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-yellow-100 rounded-b-full opacity-80"></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Smoke Effect for Blown Candles */}
                      {candlesBlown > i && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="w-2 h-8 opacity-40">
                            {Array.from({ length: 3 }).map((_, smokeI) => (
                              <div
                                key={smokeI}
                                className="absolute w-1 h-3 bg-gray-400 rounded-full animate-pulse"
                                style={{
                                  left: `${smokeI * 2}px`,
                                  top: `${smokeI * -3}px`,
                                  animationDelay: `${smokeI * 0.3}s`,
                                  opacity: 0.6 - smokeI * 0.2,
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Progress and Status */}
            <div className="mt-12 text-center">
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                  <div 
                    className="h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(candlesBlown / TOTAL_CANDLES) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xl font-semibold text-gray-700">
                  {candlesBlown === TOTAL_CANDLES ? (
                    <span className="text-2xl animate-bounce">🎊 All wishes granted! Your dreams will come true! 🎊</span>
                  ) : (
                    `${candlesBlown}/${TOTAL_CANDLES} candles blown - Keep wishing! ✨`
                  )}
                </p>
              </div>
              
              {candlesBlown === TOTAL_CANDLES && (
                <button 
                  onClick={resetCake}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 text-white text-lg font-semibold rounded-full hover:from-pink-600 hover:via-purple-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                >
                  Light the Candles Again 🕯️✨
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Wishes Section */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/40 w-full max-w-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-3">
              <Heart className="text-red-500 animate-pulse" />
              Birthday Wishes for Aiman
              <Gift className="text-purple-500 animate-bounce" />
            </h3>
            
            <div className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newWish}
                  onChange={(e) => setNewWish(e.target.value)}
                  // Changed placeholder text to correctly reflect the page's recipient, Aiman
                  placeholder="Write a beautiful wish for Aiman..." 
                  className="flex-1 p-4 border-2 border-pink-200 rounded-xl focus:ring-4 focus:ring-pink-300 focus:border-pink-400 transition-all duration-300 text-lg placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && addWish()}
                />
                <button
                  onClick={addWish}
                  className="px-6 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl hover:from-pink-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                >
                  Add Wish 💝
                </button>
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
              {wishes.map((wish, i) => (
                <div 
                  key={i} 
                  className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <p className="text-gray-700 text-lg">💕 {wish}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Special Message */}
        <div className="text-center bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-white/50 mb-12">
          <div className="text-6xl mb-6 animate-pulse">💖</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Dear Aiman
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            Happy Birthday, Aiman 💖

            On your special day, I just want to remind you how truly rare and precious you are.
            Your smile has a way of softening even the hardest moments, and your presence brings a quiet calm the world often forgets.
            Every second spent around you is a moment worth holding onto — and knowing you has always felt like a quiet kind of blessing.

            I hope this year surrounds you with peace, fills you with love, and brings your dreams to life — one by one.
            You deserve more than just happiness... you deserve the kind of joy that stays.
            Keep being the light you are — soft, strong, and unforgettable.

            Happy Birthday, to the name my heart never learned to forget. 💫🎂💐
          </p>
          <p className="text-lg text-gray-500 italic">
            With love and best wishes,<br />
            <span className="font-bold text-2xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">Aleeha Fatima</span> ❤️
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500">
          <p className="text-lg mb-4">
            Made with 💕 for someone very special
          </p>
          <div className="flex justify-center gap-6">
            <Gift className="text-yellow-500 hover:scale-125 transition-transform duration-300 animate-bounce" size={28} />
            <Heart className="text-red-500 hover:scale-125 transition-transform duration-300 animate-pulse" size={28} />
            <Users className="text-blue-500 hover:scale-125 transition-transform duration-300 animate-bounce" size={28} style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .star {
          animation: float 4s infinite ease-in-out, twinkle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;