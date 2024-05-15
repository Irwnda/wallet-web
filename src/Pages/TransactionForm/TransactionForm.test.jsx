import {
  findAllByRole,
  findByText,
  render,
  screen
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { customers, transactions, wallets } from '../../../fixtures.json';
import Transaction from '../../Transaction';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../../App';
import { BACKEND_URL, CUSTOMER_ID } from '../../constants';
import TransactionForm from './TransactionForm';

jest.mock('axios');

let customer;
let wallet;

beforeEach(() => {
  customer = customers.find((customer) => customer.id === CUSTOMER_ID);
  wallet = wallets.find((wallet) => wallet.id === customer.walletId);

  axios.get
    .mockResolvedValueOnce({ data: customer })
    .mockResolvedValueOnce({ data: wallet })
    .mockResolvedValueOnce({ data: { transactions } });
});

describe('TransactionForm', () => {
  it('should add new transaction when the submit button is clicked', async () => {
    jest.useFakeTimers({ advanceTimers: true });
    jest.setSystemTime(new Date('2024-05-15T00:00:00.000Z'));
    render(
      <MemoryRouter initialEntries={['/transaction-form']}>
        <TransactionForm />
      </MemoryRouter>
    );
    axios.post.mockResolvedValue({ data: newTransaction });
    const amountInput = screen.getByLabelText('Amount');
    const typeInput = screen.getByLabelText('Type');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByRole('button');
    const user = userEvent.setup();
    const newTransaction = new Transaction(
      3,
      new Date('2024-05-15T00:00:00.400Z'),
      100,
      'Lorem',
      'deposit'
    );
    await user.type(amountInput, `${newTransaction.amount}`);
    await user.selectOptions(typeInput, newTransaction.type);
    await user.type(descriptionInput, newTransaction.description);

    await user.click(submitButton);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `${BACKEND_URL}/wallets/${wallet.id}/transactions`,
      newTransaction.toJSON()
    );
    expect(axios.patch).toHaveBeenCalledTimes(1);
    expect(axios.patch).toHaveBeenCalledWith(
      `${BACKEND_URL}/wallets/${wallet.id}`,
      {
        balance: wallet.balance + newTransaction.amount
      }
    );
  });
});
