// hooks/useEventSource.js

import { useState, useEffect } from 'react';

const useEventSource = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (e) => {
      setData(e.data);
    };

    eventSource.onerror = (e) => {
      setError(e);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return { data, error };
};

export default useEventSource;
