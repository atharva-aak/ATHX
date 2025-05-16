import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { UserIcon } from 'lucide-react';

const Login: React.FC = () => {
  const { dispatch } = useSystem();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    dispatch({
      type: 'LOGIN_USER',
      payload: { username: username.trim() }
    });
  };
  
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-white/20 mb-4">
            <UserIcon size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to ATHX</h1>
          <p className="text-white/80">Please enter your username to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            {error && (
              <p className="mt-2 text-sm text-red-200">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-white text-blue-600 font-medium hover:bg-white/90 transition-colors"
          >
            Start Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;