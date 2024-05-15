import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BACKEND_URL, CUSTOMER_ID } from '../../constants';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../Hooks/useFetch';

const initialTransactionValue = {
  amount: 0,
  description: '',
  type: ''
};
export default function TransactionForm() {
  const { fetchedData: user } = useFetch('customers', CUSTOMER_ID);
  const { fetchedData: wallet } = useFetch('wallets', user?.walletId);
  const [transaction, setTransaction] = useState(initialTransactionValue);
  const navigate = useNavigate();

  const submitTransaction = () => {
    async function postTransaction() {
      await axios.post(`${BACKEND_URL}/wallets/${wallet.id}/transactions`, {
        ...transaction,
        date: new Date()
      });
      const additionalBalanceMultiplier =
        transaction.type === 'deposit' ? 1 : -1;
      await axios.patch(`${BACKEND_URL}/wallets/${wallet.id}`, {
        balance:
          Number(wallet.balance) +
          Number(transaction.amount) * additionalBalanceMultiplier
      });
      navigate('/');
    }

    postTransaction();
  };

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
