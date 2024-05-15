import React, { useEffect, useState } from 'react';
import { BACKEND_URL, CUSTOMER_ID } from '../../constants';
import axios from 'axios';

function getAmountTotalCategorized(transactions, type) {
  return transactions.reduce((total, transaction) => {
    const { amount } = transaction;
    if (transaction.type === type) return total + amount;
    return total;
  }, 0);
}

export default function HomePage() {
  const [user, setUser] = useState();
  const [wallet, setWallet] = useState();
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  useEffect(() => {
    async function fetchUserData() {
      const { data } = await axios.get(
        `${BACKEND_URL}/customers/${CUSTOMER_ID}`
      );
      setUser(data);
    }

    fetchUserData();
  }, [CUSTOMER_ID]);

  useEffect(() => {
    async function fetchUserWallet() {
      if (user) {
        const { data } = await axios.get(
          `${BACKEND_URL}/wallets/${user?.walletId}`
        );
        setWallet(data);
      }
    }

    fetchUserWallet();
  }, [user]);

  useEffect(() => {
    async function fetchUserTransactions() {
      if (wallet) {
        const { data } = await axios.get(
          `${BACKEND_URL}/wallets/${wallet.id}/transactions`
        );
        const { transactions } = data;
        const deposit = getAmountTotalCategorized(transactions, 'deposit');
        const withdraw = getAmountTotalCategorized(transactions, 'withdraw');
        setDepositAmount(deposit);
        setWithdrawAmount(withdraw);
      }
    }

    fetchUserTransactions();
  }, [wallet]);

  return (
    <>
      <section>
        Hello,
        <h1>{user?.name}</h1>
      </section>
      <section>
        <ul>
          <li>
            <h5>Balance</h5>
            <p>{wallet?.balance}</p>
          </li>
          <li>
            <h5>Deposit</h5>
            <p>{depositAmount}</p>
          </li>
          <li>
            <h5>Withdraw</h5>
            <p>{withdrawAmount}</p>
          </li>
        </ul>
      </section>
    </>
  );
}
