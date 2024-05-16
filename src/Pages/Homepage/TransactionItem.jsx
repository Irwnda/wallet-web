import React from 'react';

export default function TransactionItem({ transaction }) {
  return (
    <li className="transaction-item">
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
  );
}
