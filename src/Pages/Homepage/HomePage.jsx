import React, { useEffect, useState } from 'react';
import { BACKEND_URL, CUSTOMER_ID } from '../../constants';
import axios from 'axios';
import Transaction from '../../Transaction';
import useFetch from '../../Hooks/useFetch';
import GreetingUser from './GreetingUser';

function getAmountTotalCategorized(transactions, type) {
  return transactions.reduce((total, transaction) => {
    const { amount } = transaction;
    if (transaction.type === type) return total + Number(amount);
    return total;
  }, 0);
}

export default function HomePage() {
  const { fetchedData: user } = useFetch('customers', CUSTOMER_ID);
  const { fetchedData: wallet } = useFetch('wallets', user?.walletId);
  const [filterQuery, setFilterQuery] = useState('');
  const [sortByValue, setSortByValue] = useState('');
  const [sortOrderValue, setSortOrderValue] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

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
      <GreetingUser user={user} />
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
      <label htmlFor="sort-by">Sort By</label>
      <select
        name="sort-by"
        id="sort-by"
        value={sortByValue}
        onChange={(event) => setSortByValue(event.target.value)}
      >
        <option value="">Select Sorting Value</option>
        <option value="date">Date</option>
        <option value="description">Description</option>
        <option value="amount">Amount</option>
      </select>
      <label htmlFor="sort-order">Sort Order</label>
      <select
        name="sort-order"
        id="sort-order"
        value={sortOrderValue}
        onChange={(event) => setSortOrderValue(event.target.value)}
      >
        <option value="ascending">Ascending</option>
        <option value="descending">Descending</option>
      </select>
      <label htmlFor="filter">Filter</label>
      <input
        type="text"
        value={filterQuery}
        onChange={(event) => setFilterQuery(event.target.value)}
        name="filter"
        id="filter"
      />
      <section className="transaction-history-section">
        <h3>Transactions</h3>
        <ul className="transaction-history-wrapper">
          {transactions
            .filter(
              (transaction) =>
                transaction.description
                  .toLowerCase()
                  .includes(filterQuery.toLocaleLowerCase()) ||
                transaction.amount.toString().includes(filterQuery)
            )
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
    </>
  );
}
