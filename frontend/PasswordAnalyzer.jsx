import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, AlertCircle, CheckCircle, TrendingUp, Zap } from 'lucide-react';

const PasswordAnalyzer = () => {
  const [password, setPassword] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Analyze password in real-time
  useEffect(() => {
    if (password.length > 0) {
      analyzePassword(password);
    } else {
      setAnalysis(null);
      setSuggestions([]);
    }
  }, [password]);

  const analyzePassword = async (pwd) => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd })
      });

      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      setAnalysis(data);

      // Get suggestions
      await getSuggestions(pwd);
    } catch (error) {
      console.error('Error analyzing password:', error);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async (pwd) => {
    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd })
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(text);
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const getStrengthColor = (score) => {
    if (score >= 80) return 'from-emerald-400 to-green-600';
    if (score >= 60) return 'from-blue-400 to-blue-600';
    if (score >= 40) return 'from-amber-400 to-orange-600';
    if (score >= 20) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-red-600';
  };

  const getStrengthTextColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    if (score >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Grid background effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-slate-100"></div>
      </div>

      {/* Animated gradient orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Password<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Guard</span>
            </h1>
          </div>
          <p className="text-slate-300 text-lg">AI-Powered Password Strength Analyzer</p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
          {/* Password Input */}
          <div className="mb-8">
            <label className="block text-slate-200 font-semibold mb-3">Enter Your Password</label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type your password to analyze..."
                className="w-full px-5 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <p className="text-slate-400 text-sm mt-2">🔒 Your password is analyzed locally and never stored</p>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Security Score */}
              <div>
                <div className="flex items-end justify-between mb-3">
                  <label className="text-slate-200 font-semibold">Security Score</label>
                  <span className={`text-2xl font-bold ${getStrengthTextColor(analysis.security_score)}`}>
                    {analysis.security_score.toFixed(1)}/100
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden border border-slate-600">
                  <div
                    className={`h-full bg-gradient-to-r ${getStrengthColor(analysis.security_score)} transition-all duration-500`}
                    style={{ width: `${analysis.security_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Strength Badge */}
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${
                  analysis.security_score >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                  analysis.security_score >= 60 ? 'bg-blue-500/20 text-blue-400' :
                  analysis.security_score >= 40 ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {analysis.security_score >= 80 ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Strength Level</p>
                  <p className={`text-xl font-bold ${getStrengthTextColor(analysis.security_score)}`}>
                    {analysis.strength_level}
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Length */}
                <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-1">Password Length</p>
                  <p className="text-2xl font-bold text-slate-100">{analysis.password_length}</p>
                  <p className="text-slate-500 text-xs mt-2">{analysis.password_length >= 12 ? '✅ Good' : '⚠️ Could be longer'}</p>
                </div>

                {/* Entropy */}
                <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-1">Entropy</p>
                  <p className="text-2xl font-bold text-blue-400">{analysis.entropy.toFixed(1)}</p>
                  <p className="text-slate-500 text-xs mt-2">bits of randomness</p>
                </div>

                {/* Crack Time */}
                <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4 md:col-span-2">
                  <p className="text-slate-400 text-sm mb-1">Time to Crack (GPU Brute Force)</p>
                  <p className="text-2xl font-bold text-purple-400">{analysis.crack_time_readable}</p>
                  <p className="text-slate-500 text-xs mt-2">Assuming 1 trillion guesses/second</p>
                </div>
              </div>

              {/* Character Analysis */}
              <div>
                <p className="text-slate-200 font-semibold mb-3">Character Composition</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Uppercase', value: analysis.has_uppercase, icon: 'A' },
                    { label: 'Lowercase', value: analysis.has_lowercase, icon: 'a' },
                    { label: 'Numbers', value: analysis.has_numbers, icon: '0' },
                    { label: 'Special Chars', value: analysis.has_special_chars, icon: '!' }
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`p-3 rounded-lg text-center border transition-all ${
                        item.value
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'bg-slate-700/30 border-slate-600/50 text-slate-500'
                      }`}
                    >
                      <p className="text-2xl font-bold mb-1">{item.icon}</p>
                      <p className="text-xs">{item.label}</p>
                      <p className="text-lg">{item.value ? '✓' : '✗'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warnings */}
              {(analysis.is_common || analysis.has_keyboard_pattern || analysis.has_sequential_chars) && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-semibold mb-2">⚠️ Security Issues Detected</p>
                      <ul className="text-red-300 text-sm space-y-1">
                        {analysis.is_common && <li>• This is a commonly used password</li>}
                        {analysis.has_keyboard_pattern && <li>• Contains keyboard patterns (qwerty, 123456)</li>}
                        {analysis.has_sequential_chars && <li>• Contains sequential characters (abc, 123)</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="text-blue-400 font-semibold mb-3">💡 Suggestions to Improve</p>
                  <ul className="text-blue-300 text-sm space-y-2">
                    {analysis.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Performance Metrics */}
              <div className="border-t border-slate-700 pt-4">
                <div className="flex items-center justify-between text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Analysis Latency: <span className="text-slate-200 font-semibold">{analysis.estimated_latency_ms.toFixed(2)}ms</span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!password && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">👇 Enter a password to analyze its strength</p>
            </div>
          )}
        </div>

        {/* Suggested Passwords */}
        {suggestions.length > 0 && (
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Recommended Strong Passwords</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((pwd, idx) => (
                <div key={idx} className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4 group hover:border-purple-500/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-slate-400 text-sm mb-1">Suggestion #{idx + 1}</p>
                      <p className="font-mono text-white break-all select-all">{pwd.password}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(pwd.password)}
                      className="ml-2 p-2 hover:bg-slate-600 rounded-lg transition-colors flex-shrink-0"
                      title="Copy to clipboard"
                    >
                      {copyFeedback === pwd.password ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-slate-400 group-hover:text-white" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-slate-500">Entropy</p>
                      <p className="text-blue-400 font-semibold">{pwd.entropy.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Score</p>
                      <p className="text-emerald-400 font-semibold">{pwd.security_score.toFixed(1)}/100</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-slate-400 text-sm">
          <p>🔐 PasswordGuard | Your password is your fortress</p>
          <p className="mt-2">Built with React, FastAPI & Node.js</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default PasswordAnalyzer;
