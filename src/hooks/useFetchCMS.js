import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = '/api';

export function useFetchCMS() {
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cms/home`);
      if (response.data.status === 'success') {
        setCmsData(response.data.data);
      } else {
        throw new Error('API hatası');
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Hata oluştu');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Admin panelinden güncelleme geldiğinde veriyi tazelemek için bir yöntem (opsiyonel)
    const handleUpdate = () => fetchData();
    window.addEventListener('cms-update', handleUpdate);
    return () => window.removeEventListener('cms-update', handleUpdate);
  }, []);

  return { cmsData, loading, error, refresh: fetchData };
}
