import axios from 'axios';
import React, { useState } from 'react';
import { BACKEND_URL } from '../../constants';

const initialTransactionValue = {
  amount: 0,
  description: '',
  type: ''
};
export default function TransactionForm() {
  const [transaction, setTransaction] = useState(initialTransactionValue);
  const wallet = {
    id: 1
  };

  const submitTransaction = () => {
    async function postTransaction() {
      await axios.post(`${BACKEND_URL}/wallets/${wallet.id}/transactions`, {
        ...transaction,
        date: new Date()
      });
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
