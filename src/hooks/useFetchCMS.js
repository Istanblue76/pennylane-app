import { useState, useEffect } from 'react';
import axios from 'axios';
import fallbackData from '../utils/mockData.json';

export function useFetchCMS() {
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getApiBase = () => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocal ? 'http://localhost:5000' : '';
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${getApiBase()}/api/cms`);
      // Gelen veri doğrudan obje mi yoksa {status, data} şeklinde mi kontrol ediyoruz
      const data = response.data.status === 'success' ? response.data.data : response.data;
      
      if (data && Object.keys(data).length > 0) {
        setCmsData(data);
        setError(null);
      } else {
        throw new Error('Boş veri');
      }
    } catch (err) {
      console.warn('API Bağlanamadı, Yerel Veri Kullanılıyor:', err.message);
      // API hata verse de siteyi aç:
      setCmsData(fallbackData);
      // Sadece yerelde geliştiriciye hata gösterelim, canlıda siteyi kapatmayalım
      if (window.location.hostname === 'localhost') {
        // setError(err.message); // Yerelde debug için aktif edilebilir
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('cms-update', fetchData);
    return () => window.removeEventListener('cms-update', fetchData);
  }, []);

  return { cmsData, loading, error, refresh: fetchData };
}
