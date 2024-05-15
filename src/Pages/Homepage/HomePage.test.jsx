import axios from 'axios';
import { customers, transactions, wallets } from '../../../fixtures.json';
import {
  findByText,
  getAllByRole,
  getByRole,
  render,
  screen
} from '@testing-library/react';
import HomePage from './HomePage';
import { BACKEND_URL, CUSTOMER_ID } from '../../constants';

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

afterEach(() => {
  jest.resetAllMocks();
});

describe('HomePage', () => {
  it('should display greetings on homepage and "Hello," text', async () => {
    render(<HomePage />);
    const helloTextElement = screen.getByText('Hello,');
    const greetingElement = await screen.findByRole('heading', {
      level: 1,
      name: customer.name
    });

    expect(helloTextElement).toBeInTheDocument();
    expect(greetingElement).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledTimes(3);
    expect(axios.get).toHaveBeenCalledWith(
      `${BACKEND_URL}/customers/${CUSTOMER_ID}`
    );
  });

  it('should render balance, deposit total and withdraw total', async () => {
    render(<HomePage />);
    const balanceInformation = screen.getByRole('list');
    const [balanceElement, depositElement, withdrawElement] = getAllByRole(
      balanceInformation,
      'listitem'
    );
    const balanceTitle = getByRole(balanceElement, 'heading', {
      level: 5,
      name: /balance/i
    });
    const depositTitle = getByRole(depositElement, 'heading', {
      level: 5,
      name: /deposit/i
    });
    const withdrawTitle = getByRole(withdrawElement, 'heading', {
      level: 5,
      name: /withdraw/i
    });
    const balanceAmount = await findByText(balanceElement, wallet.balance);
    const depositAmount = await findByText(
      depositElement,
      transactions[0].amount
    );
    const withdrawAmount = await findByText(
      withdrawElement,
      transactions[1].amount
    );

    expect(balanceTitle).toBeInTheDocument();
    expect(depositTitle).toBeInTheDocument();
    expect(withdrawTitle).toBeInTheDocument();
    expect(balanceAmount).toBeInTheDocument();
    expect(depositAmount).toBeInTheDocument();
    expect(withdrawAmount).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledTimes(3);
    expect(axios.get).toHaveBeenNthCalledWith(
      2,
      `${BACKEND_URL}/wallets/${customer.walletId}`
    );
    expect(axios.get).toHaveBeenNthCalledWith(
      3,
      `${BACKEND_URL}/wallets/${customer.walletId}/transactions`
    );
  });
});
