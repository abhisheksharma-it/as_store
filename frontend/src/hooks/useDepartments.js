import { useState, useEffect } from 'react';
import axios from 'axios';

export function useDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDepartments() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/api/catalog/departments/',
          { signal: controller.signal }
        );
        setDepartments(response.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err instanceof Error ? err.message : 'Failed to load departments.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchDepartments();

    return () => controller.abort();
  }, []);

  return { departments, loading, error };
}
