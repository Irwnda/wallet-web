import React from 'react';

export default function TransactionList({
  transactions,
  filterQuery,
  sortByValue,
  sortOrderValue
}) {
  return (
    <section className="transaction-history-section">
      <h3>Transactions</h3>
      <ul className="transaction-history-wrapper">
        {transactions
          .filter((transaction) => transaction.filter(filterQuery))
          .sort((firstTransaction, secondTransaction) =>
            firstTransaction.comparesTo(
              secondTransaction,
              sortByValue,
              sortOrderValue
            )
          )
          .map((transaction) => (
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
  );
}
