import React, { useEffect, useState } from 'react';
import { BACKEND_URL, CUSTOMER_ID } from '../../constants';
import axios from 'axios';

export default function HomePage() {
  const [user, setUser] = useState();

  useEffect(() => {
    async function fetchUserData() {
      const { data } = await axios.get(
        `${BACKEND_URL}/customers/${CUSTOMER_ID}`
      );
      setUser(data);
    }

    fetchUserData();
  }, [CUSTOMER_ID]);

  return (
    <section>
      Hello,
      <h1>{user?.name}</h1>
    </section>
  );
}
