import React from 'react';

export default function BalanceInformation({ balance, deposit, withdraw }) {
  return (
    <section>
      <ul className="balance-information-wrapper">
        <li className="balance-information-card">
          <h5>Balance</h5>
          <p>{balance}</p>
          <img src="/jenius-orange.png" alt="Jenius Logo Orange" />
        </li>
        <li className="deposit-information-card">
          <h5>Deposit</h5>
          <p>{deposit}</p>
          <img src="/jenius-yellow.png" alt="Jenius Logo Yellow" />
        </li>
        <li className="withdraw-information-card">
          <h5>Withdraw</h5>
          <p>{withdraw}</p>
          <img src="/jenius-blue.png" alt="Jenius Logo Blue" />
        </li>
      </ul>
    </section>
  );
}
