import axios from 'axios';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../constants';

const useFetch = (route, identifier) => {
  const [fetchedData, setFetchedData] = useState();

  useEffect(() => {
    async function fetchData() {
      if (identifier) {
        const { data } = await axios.get(
          `${BACKEND_URL}/${route}/${identifier}`
        );
        setFetchedData(data);
      }
    }

    fetchData();
  }, [route, identifier]);

  return { fetchedData };
};

export default useFetch;
