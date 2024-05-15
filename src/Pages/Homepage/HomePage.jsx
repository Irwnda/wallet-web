import React, { useEffect, useState } from 'react';
import { BACKEND_URL, CUSTOMER_ID } from '../../constants';
import axios from 'axios';
import Transaction from '../../Transaction';

function getAmountTotalCategorized(transactions, type) {
  return transactions.reduce((total, transaction) => {
    const { amount } = transaction;
    if (transaction.type === type) return total + Number(amount);
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
          (transaction) => {
            const { id, date, amount, description, type } = transaction;

            return new Transaction(id, date, amount, description, type);
          }
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
      <section className="greetings-wrapper">
        Hello,
        <h1>{user?.name}</h1>
      </section>
      <section>
        <ul className="balance-information-wrapper">
          <li className="balance-information-card">
            <h5>Balance</h5>
            <p>{wallet?.balance}</p>
          </li>
          <li className="deposit-information-card">
            <h5>Deposit</h5>
            <p>{depositAmount}</p>
          </li>
          <li className="withdraw-information-card">
            <h5>Withdraw</h5>
            <p>{withdrawAmount}</p>
          </li>
        </ul>
      </section>
      <section className="transaction-history-section">
        <h3>Transactions</h3>
        <ul className="transaction-history-wrapper">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="transaction-item">
              <ul>
                <li className="financial-detail">
                  <span>{transaction.type}</span>
                  <span>{transaction.amount}</span>
                </li>
                <li className="transaction-context">
                  <span>{transaction.description}</span>
                  <span>{transaction.date}</span>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
