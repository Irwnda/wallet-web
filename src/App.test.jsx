import {
  findByText,
  getAllByRole,
  getByRole,
  getByText,
  render,
  screen
} from '@testing-library/react';
import App from './App';
import { customers, transactions, wallets } from '../fixtures.json';
import { CUSTOMER_ID } from './constants';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

let customer;
let wallet;

jest.mock('axios');

beforeEach(() => {
  customer = customers.find((customer) => customer.id === CUSTOMER_ID);
  wallet = wallets.find((wallet) => wallet.id === customer.walletId);

  axios.get
    .mockResolvedValueOnce({ data: customer })
    .mockResolvedValueOnce({ data: wallet })
    .mockResolvedValue({ data: { transactions } });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('App', () => {
  describe('should navigate from homepage', () => {
    it('should display form in the transaction form page', async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      const navigationBar = screen.getByRole('navigation');
      const transactionFormLink = getByText(navigationBar, 'Transaction Form');
      const user = userEvent.setup();

      await user.click(transactionFormLink);

      const amountInput = screen.getByLabelText('Amount');
      const typeInput = screen.getByLabelText('Type');
      const descriptionInput = screen.getByLabelText('Description');
      const submitButton = screen.getByRole('button');

      expect(amountInput).toBeInTheDocument();
      expect(typeInput).toBeInTheDocument();
      expect(descriptionInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('should navigate from transaction form page', () => {
    it('should display information in the homepage', async () => {
      render(
        <MemoryRouter initialEntries={['/transaction-form']}>
          <App />
        </MemoryRouter>
      );
      const navigationBar = screen.getByRole('navigation');
      const homepageLink = getByText(navigationBar, 'Home');
      const user = userEvent.setup();

      await user.click(homepageLink);

      const WALLET_BALANCE_INFORMATION_INDEX_LIST = 0;
      const balanceInformation =
        screen.getAllByRole('list')[WALLET_BALANCE_INFORMATION_INDEX_LIST];
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

      expect(balanceTitle).toBeInTheDocument();
      expect(depositTitle).toBeInTheDocument();
      expect(withdrawTitle).toBeInTheDocument();
    });
  });
});
