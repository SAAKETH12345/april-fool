/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, AlertCircle, Share2, RefreshCw, GraduationCap, Landmark } from 'lucide-react';
import confetti from 'canvas-confetti';

type Step = 'form' | 'loading' | 'result';

const LOADING_MESSAGES = [
  "Connecting to university database...",
  "Fetching OMR sheet data...",
  "Evaluating supplementary scripts...",
  "Calculating SGPA & CGPA...",
  "Finalizing grade points...",
  "Generating result card..."
];

export default function App() {
  const [step, setStep] = useState<Step>('form');
  const [htno, setHtno] = useState('');
  const [semester, setSemester] = useState('8');
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [captcha, setCaptcha] = useState('');
  const [expectedCaptcha, setExpectedCaptcha] = useState('');
  const [error, setError] = useState('');

  // Generate a random math captcha
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setExpectedCaptcha(`${num1 + num2}`);
    setCaptcha(`${num1} + ${num2} = ?`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (htno.length < 10) {
      setError('Please enter a valid 10-character Hall Ticket Number.');
      return;
    }

    const userCaptcha = (document.getElementById('captcha') as HTMLInputElement).value;
    if (userCaptcha !== expectedCaptcha) {
      setError('Invalid Captcha. Please try again.');
      generateCaptcha();
      (document.getElementById('captcha') as HTMLInputElement).value = '';
      return;
    }

    setStep('loading');
  };

  // Handle loading state progression
  useEffect(() => {
    if (step === 'loading') {
      const interval = setInterval(() => {
        setLoadingMsgIdx((prev) => {
          if (prev >= LOADING_MESSAGES.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setStep('result');
              fireConfetti();
            }, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 800);

      return () => clearInterval(interval);
    }
  }, [step]);

  const fireConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#00ff00', '#0000ff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#00ff00', '#0000ff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleShare = async () => {
    const shareText = "B.Tech Regular/Supply Results are OUT! Check yours now before the server crashes! 😱🔥";
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'B.Tech Results Declared',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert('Link copied to clipboard! Send it to your friends to scare them.');
    }
  };

  const reset = () => {
    setStep('form');
    setHtno('');
    setLoadingMsgIdx(0);
    generateCaptcha();
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans text-slate-800 flex flex-col">
      {/* Official-looking Header */}
      <header className="bg-white border-b-4 border-[#003366] shadow-sm relative overflow-hidden">
        {/* Subtle background gradient to match the image's light blue hints */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-blue-50 opacity-50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left relative z-10">
          {/* Left Logo */}
          <div className="flex-shrink-0">
            <img 
              src="https://i.ibb.co/TM1dNt55/jntuhlogo.png" 
              alt="JNTUH Logo" 
              className="w-20 h-20 md:w-24 md:h-24 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Center Text */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-xl md:text-3xl font-bold text-[#d81b60] mb-1 text-center">
              Jawaharlal Nehru Technological University Hyderabad
            </h1>
            <p className="text-xs md:text-sm text-slate-800 font-semibold mb-1 text-center">
              Kukatpally, Hyderabad - 500 085, Telangana, India
            </p>
            <p className="text-xs md:text-base text-[#ff0000] font-bold uppercase tracking-wide text-center">
              ACCREDITED BY NAAC WITH 'A+' GRADE
            </p>
          </div>

          {/* Right Logo Placeholder (CSS approximation of Telangana Rising) */}
          <div className="flex-shrink-0 hidden md:flex flex-col items-center justify-center w-24">
            <div className="relative flex flex-col items-center">
              <span className="text-6xl font-black text-[#003366] tracking-tighter leading-none" style={{ WebkitTextStroke: '1px white' }}>1</span>
              <div className="text-[10px] font-bold text-center leading-none mt-1">
                <span className="text-[#003366]">TELANGANA</span><br/>
                <span className="text-[#ff0000]">RISING</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Marquee Alert */}
      <div className="bg-red-600 text-white overflow-hidden py-1.5 shadow-inner">
        <div className="whitespace-nowrap animate-[marquee_15s_linear_infinite] font-medium text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 inline" />
          FLASH: B.Tech I, II, III, IV Year (R25, R22, R18, R16) Regular/Supplementary March 2026 Results Declared! Server experiencing heavy load. Please check your results immediately.
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full bg-white rounded-lg shadow-xl border-t-4 border-[#003366] overflow-hidden"
            >
              <div className="bg-slate-100 border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-[#003366] flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  B.Tech Semester Results Portal
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="htno" className="block text-sm font-medium text-slate-700 mb-1">
                      Hall Ticket Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="htno"
                      type="text"
                      required
                      value={htno}
                      onChange={(e) => setHtno(e.target.value.toUpperCase())}
                      placeholder="e.g. 25311A052"
                      className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-colors uppercase font-mono"
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <label htmlFor="semester" className="block text-sm font-medium text-slate-700 mb-1">
                      Select Semester <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="semester"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-colors bg-white"
                    >
                      <option value="1">I Year I Semester</option>
                      <option value="2">I Year II Semester</option>
                      <option value="3">II Year I Semester</option>
                      <option value="4">II Year II Semester</option>
                      <option value="5">III Year I Semester</option>
                      <option value="6">III Year II Semester</option>
                      <option value="7">IV Year I Semester</option>
                      <option value="8">IV Year II Semester</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="captcha" className="block text-sm font-medium text-slate-700 mb-1">
                      Security Captcha <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <div className="bg-slate-100 border border-slate-300 rounded px-4 py-2 font-mono font-bold text-lg tracking-widest text-slate-600 select-none flex items-center justify-center min-w-[120px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0xIDFMMyAzTTEgM0wzIDEiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]">
                        {captcha}
                      </div>
                      <input
                        id="captcha"
                        type="text"
                        required
                        placeholder="Enter result"
                        className="flex-1 px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    type="submit"
                    className="bg-[#003366] hover:bg-[#002244] text-white px-8 py-2.5 rounded font-medium transition-colors flex items-center gap-2 shadow-md"
                  >
                    <Search className="w-4 h-4" />
                    Get Result
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full bg-white rounded-lg shadow-xl border-t-4 border-[#003366] p-12 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-[#003366] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-[#003366] opacity-50" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-800">Processing Request</h3>
                <p className="text-slate-500 font-mono text-sm h-5">
                  {LOADING_MESSAGES[loadingMsgIdx]}
                </p>
              </div>

              <div className="w-full max-w-xs bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  className="bg-[#003366] h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((loadingMsgIdx + 1) / LOADING_MESSAGES.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-red-500 relative"
            >
              <div className="bg-red-500 text-white p-8 text-center">
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl sm:text-6xl font-black uppercase tracking-wider mb-2"
                >
                  April Fool! 😁
                </motion.h2>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-red-100 text-lg sm:text-xl font-medium"
                >
                  Did your heart skip a beat? 
                </motion.p>
              </div>

              <div className="p-8 text-center space-y-8">
                <div className="space-y-4">
                  <p className="text-xl text-slate-700">
                    Your results for <span className="font-bold text-[#003366]">{htno}</span> aren't out yet!
                  </p>
                  <p className="text-slate-500">
                    April Fool 😁😁,Sorry for wasting your valuble Time
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button
                    onClick={handleShare}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Share2 className="w-5 h-5" />
                    Prank Your Friends
                  </button>
                  <button
                    onClick={reset}
                    className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 py-6 text-center text-sm mt-auto">
        <p>© 2026 State Board of Technical Education. All rights reserved.</p>
        <p className="mt-1 text-xs opacity-50">This is a prank website. Not affiliated with any real university or government body.</p>
      </footer>
    </div>
  );
}
