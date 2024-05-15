import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BACKEND_URL, CUSTOMER_ID } from '../../constants';
import { useNavigate } from 'react-router-dom';

const initialTransactionValue = {
  amount: 0,
  description: '',
  type: ''
};
export default function TransactionForm() {
  const [user, setUser] = useState();
  const [wallet, setWallet] = useState();
  const [transaction, setTransaction] = useState(initialTransactionValue);
  const navigate = useNavigate();

  const submitTransaction = () => {
    async function postTransaction() {
      await axios.post(`${BACKEND_URL}/wallets/${wallet.id}/transactions`, {
        ...transaction,
        date: new Date()
      });
      await axios.patch(`${BACKEND_URL}/wallets/${wallet.id}`, {
        balance: Number(wallet.balance) + Number(transaction.amount)
      });
      navigate('/');
    }

    postTransaction();
  };

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

  return (
    <div className="form-container">
      <label htmlFor="amount">Amount</label>
      <input
        id="amount"
        type="number"
        min={0}
        value={transaction.amount}
        onChange={(event) =>
          setTransaction((previousValue) => ({
            ...previousValue,
            amount: event.target.value
          }))
        }
      ></input>
      <label htmlFor="type">Type</label>
      <select
        name="type"
        id="type"
        value={transaction.type}
        onChange={(event) =>
          setTransaction((previousValue) => ({
            ...previousValue,
            type: event.target.value
          }))
        }
      >
        <option value="" disabled>
          Select type
        </option>
        <option value="deposit">Deposit</option>
        <option value="withdraw">Withdraw</option>
      </select>
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        value={transaction.description}
        onChange={(event) =>
          setTransaction((previousValue) => ({
            ...previousValue,
            description: event.target.value
          }))
        }
      ></textarea>
      <button type="submit" onClick={submitTransaction}>
        Submit
      </button>
    </div>
  );
}
