import React, { useEffect, useState } from 'react';
import { BACKEND_URL, CUSTOMER_ID } from '../../constants';
import axios from 'axios';
import Transaction from '../../Transaction';
import useFetch from '../../Hooks/useFetch';
import GreetingUser from './GreetingUser';
import BalanceInformation from './BalanceInformation';
import Sorting from './Sorting';
import Filter from './Filter';

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
      <BalanceInformation
        balance={wallet?.balance}
        deposit={depositAmount}
        withdraw={withdrawAmount}
      />
      <Sorting
        sortByValue={sortByValue}
        sortOrderValue={sortOrderValue}
        setSortByValue={setSortByValue}
        setSortOrderValue={setSortOrderValue}
      />
      <Filter filterQuery={filterQuery} setFilterQuery={setFilterQuery} />
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
    </>
  );
}
