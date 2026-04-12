import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Infinity, Lock, User } from 'lucide-react';
import Button from '../../components/Common/Button';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resp = await axios.post('/api/login', { username, password });
      if (resp.data.status === 'success') {
        localStorage.setItem('adminToken', resp.data.token);
        navigate('/admin');
      }
    } catch (err) {
      setError('Hatalı kullanıcı adı veya şifre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-primary/40 backdrop-blur-xl border-2 border-secondary/20 p-12 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rotate-45 translate-x-12 -translate-y-12" />
        
        <div className="flex flex-col items-center mb-10 text-center">
          <img src="/assets/img/pennylane_logo_white.png" alt="Pennylane Logo" className="h-16 mb-6" />
          <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-widest mb-2">PENNYLANE YÖNETİM</h1>
          <p className="text-textSecondary text-sm font-light italic">Lütfen yetkili girişi yapın.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
            <input 
              type="text" 
              placeholder="Kullanıcı Adı" 
              className="w-full bg-dark/50 border border-secondary/20 rounded-xl px-12 py-4 text-white focus:border-secondary outline-none transition-all group-focus-within:border-secondary shadow-lg shadow-black/20"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
            <input 
              type="password" 
              placeholder="Şifre" 
              className="w-full bg-dark/50 border border-secondary/20 rounded-xl px-12 py-4 text-white focus:border-secondary outline-none transition-all group-focus-within:border-secondary shadow-lg shadow-black/20"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm italic animate-shake">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full py-4 text-lg">
            {loading ? 'GİRİŞ YAPILIYOR...' : 'SİSTEME GİRİŞ YAP'}
          </Button>
        </form>
        
        <div className="mt-12 text-center text-[10px] uppercase font-bold tracking-[0.5em] text-textSecondary opacity-40">
          PENNYLANE CMS SECURITY v1.0
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
