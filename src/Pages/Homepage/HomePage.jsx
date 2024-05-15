import React, { useEffect, useState } from 'react';
import { BACKEND_URL, CUSTOMER_ID } from '../../constants';
import axios from 'axios';
import TransactionDate from '../../TransactionDate';

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
  const [transactions, setTransactions] = useState([]);
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
        const { transactions: fetchedTransactions } = data;
        const customDateTransactions = fetchedTransactions.map(
          (transaction) => ({
            ...transaction,
            date: new TransactionDate(transaction.date)
          })
        );
        setTransactions(customDateTransactions);
      }
    }

    fetchUserTransactions();
  }, [wallet]);

  useEffect(() => {
    if (transactions.length) {
      const deposit = getAmountTotalCategorized(transactions, 'deposit');
      const withdraw = getAmountTotalCategorized(transactions, 'withdraw');
      setDepositAmount(deposit);
      setWithdrawAmount(withdraw);
    }
  }, [transactions]);

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
      <section>
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <ul>
                <li>
                  <span>{transaction.type}</span>
                  <span>{transaction.amount}</span>
                </li>
                <li>
                  <span>{transaction.description}</span>
                  <span>{`${transaction.date}`}</span>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
