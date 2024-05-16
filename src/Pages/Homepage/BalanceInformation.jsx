import React from 'react';

export default function BalanceInformation({ balance, deposit, withdraw }) {
  return (
    <section>
      <ul className="balance-information-wrapper">
        <li className="balance-information-card">
          <h5>Balance</h5>
          <p>{balance}</p>
        </li>
        <li className="deposit-information-card">
          <h5>Deposit</h5>
          <p>{deposit}</p>
        </li>
        <li className="withdraw-information-card">
          <h5>Withdraw</h5>
          <p>{withdraw}</p>
        </li>
      </ul>
    </section>
  );
}
