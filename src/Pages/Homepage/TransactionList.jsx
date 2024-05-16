import React from 'react';
import TransactionItem from './TransactionItem';

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
            <TransactionItem transaction={transaction} key={transaction.id} />
          ))}
      </ul>
    </section>
  );
}
