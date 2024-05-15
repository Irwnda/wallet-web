import axios from 'axios';
import { customers, transactions, wallets } from '../../../fixtures.json';
import {
  findByText,
  getAllByRole,
  getByRole,
  queryByText,
  render,
  screen
} from '@testing-library/react';
import HomePage from './HomePage';
import { BACKEND_URL, CUSTOMER_ID } from '../../constants';
import Transaction from '../../Transaction';
import userEvent from '@testing-library/user-event';

jest.mock('axios');

let customer;
let wallet;

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

  it('should render history of the transactions', async () => {
    render(<HomePage />);
    const TRANSACTION_HISTORY_INDEX_LIST = 1;
    const transactionHistoryElement =
      screen.getAllByRole('list')[TRANSACTION_HISTORY_INDEX_LIST];

    const firstTransaction = transactions[0];
    const {
      id: firstId,
      date: firstDate,
      amount: firstAmount,
      description: firstDescription,
      type: firstType
    } = firstTransaction;
    const firstTransactionInstance = new Transaction(
      firstId,
      firstDate,
      firstAmount,
      firstDescription,
      firstType
    );
    const typeInFirstTransaction = await findByText(
      transactionHistoryElement,
      firstTransactionInstance.type
    );
    const descriptionInFirstTransaction = await findByText(
      transactionHistoryElement,
      firstTransactionInstance.description
    );
    const amountInFirstTransaction = await findByText(
      transactionHistoryElement,
      firstTransactionInstance.amount
    );
    const dateInFirstTransaction = await findByText(
      transactionHistoryElement,
      firstTransactionInstance.date
    );
    expect(typeInFirstTransaction).toBeInTheDocument();
    expect(descriptionInFirstTransaction).toBeInTheDocument();
    expect(amountInFirstTransaction).toBeInTheDocument();
    expect(dateInFirstTransaction).toBeInTheDocument();

    const secondTransaction = transactions[1];
    const {
      id: secondId,
      date: secondDate,
      amount: secondAmount,
      description: secondDescription,
      type: secondType
    } = secondTransaction;
    const secondTransactionInstance = new Transaction(
      secondId,
      secondDate,
      secondAmount,
      secondDescription,
      secondType
    );
    const typeInSecondTransaction = await findByText(
      transactionHistoryElement,
      secondTransactionInstance.type
    );
    const descriptionInSecondTransaction = await findByText(
      transactionHistoryElement,
      secondTransactionInstance.description
    );
    const amountInSecondTransaction = await findByText(
      transactionHistoryElement,
      secondTransactionInstance.amount
    );
    const dateInSecondTransaction = await findByText(
      transactionHistoryElement,
      secondTransactionInstance.date
    );

    expect(typeInSecondTransaction).toBeInTheDocument();
    expect(descriptionInSecondTransaction).toBeInTheDocument();
    expect(amountInSecondTransaction).toBeInTheDocument();
    expect(dateInSecondTransaction).toBeInTheDocument();
  });

  it('should only show the first transaction when filtered "Depo"', async () => {
    render(<HomePage />);
    const user = userEvent.setup();
    const filterQuery = 'Depo';
    const filterInput = screen.getByLabelText('Filter');
    await user.type(filterInput, filterQuery);

    const TRANSACTION_HISTORY_INDEX_LIST = 1;
    const transactionHistoryElement =
      screen.getAllByRole('list')[TRANSACTION_HISTORY_INDEX_LIST];

    const firstTransaction = transactions[0];
    const {
      id: firstId,
      date: firstDate,
      amount: firstAmount,
      description: firstDescription,
      type: firstType
    } = firstTransaction;
    const firstTransactionInstance = new Transaction(
      firstId,
      firstDate,
      firstAmount,
      firstDescription,
      firstType
    );
    const typeInFirstTransaction = await findByText(
      transactionHistoryElement,
      firstTransactionInstance.type
    );
    const descriptionInFirstTransaction = await findByText(
      transactionHistoryElement,
      firstTransactionInstance.description
    );
    const amountInFirstTransaction = await findByText(
      transactionHistoryElement,
      firstTransactionInstance.amount
    );
    const dateInFirstTransaction = await findByText(
      transactionHistoryElement,
      firstTransactionInstance.date
    );

    expect(typeInFirstTransaction).toBeInTheDocument();
    expect(descriptionInFirstTransaction).toBeInTheDocument();
    expect(amountInFirstTransaction).toBeInTheDocument();
    expect(dateInFirstTransaction).toBeInTheDocument();

    const secondTransaction = transactions[1];
    const {
      id: secondId,
      date: secondDate,
      amount: secondAmount,
      description: secondDescription,
      type: secondType
    } = secondTransaction;
    const secondTransactionInstance = new Transaction(
      secondId,
      secondDate,
      secondAmount,
      secondDescription,
      secondType
    );
    const typeInSecondTransaction = queryByText(
      transactionHistoryElement,
      secondTransactionInstance.type
    );
    const descriptionInSecondTransaction = queryByText(
      transactionHistoryElement,
      secondTransactionInstance.description
    );
    const amountInSecondTransaction = queryByText(
      transactionHistoryElement,
      secondTransactionInstance.amount
    );
    const dateInSecondTransaction = queryByText(
      transactionHistoryElement,
      secondTransactionInstance.date
    );

    expect(typeInSecondTransaction).toBeNull();
    expect(descriptionInSecondTransaction).toBeNull();
    expect(amountInSecondTransaction).toBeNull();
    expect(dateInSecondTransaction).toBeNull();
  });

  it('should only show the second transaction when filtered "50"', async () => {
    render(<HomePage />);
    const user = userEvent.setup();
    const filterQuery = '50';
    const filterInput = screen.getByLabelText('Filter');
    await user.type(filterInput, filterQuery);

    const TRANSACTION_HISTORY_INDEX_LIST = 1;
    const transactionHistoryElement =
      screen.getAllByRole('list')[TRANSACTION_HISTORY_INDEX_LIST];

    const firstTransaction = transactions[0];
    const {
      id: firstId,
      date: firstDate,
      amount: firstAmount,
      description: firstDescription,
      type: firstType
    } = firstTransaction;
    const firstTransactionInstance = new Transaction(
      firstId,
      firstDate,
      firstAmount,
      firstDescription,
      firstType
    );
    const typeInFirstTransaction = queryByText(
      transactionHistoryElement,
      firstTransactionInstance.type
    );
    const descriptionInFirstTransaction = queryByText(
      transactionHistoryElement,
      firstTransactionInstance.description
    );
    const amountInFirstTransaction = queryByText(
      transactionHistoryElement,
      firstTransactionInstance.amount
    );
    const dateInFirstTransaction = queryByText(
      transactionHistoryElement,
      firstTransactionInstance.date
    );

    expect(typeInFirstTransaction).toBeNull();
    expect(descriptionInFirstTransaction).toBeNull();
    expect(amountInFirstTransaction).toBeNull();
    expect(dateInFirstTransaction).toBeNull();

    const secondTransaction = transactions[1];
    const {
      id: secondId,
      date: secondDate,
      amount: secondAmount,
      description: secondDescription,
      type: secondType
    } = secondTransaction;
    const secondTransactionInstance = new Transaction(
      secondId,
      secondDate,
      secondAmount,
      secondDescription,
      secondType
    );
    const typeInSecondTransaction = await findByText(
      transactionHistoryElement,
      secondTransactionInstance.type
    );
    const descriptionInSecondTransaction = await findByText(
      transactionHistoryElement,
      secondTransactionInstance.description
    );
    const amountInSecondTransaction = await findByText(
      transactionHistoryElement,
      secondTransactionInstance.amount
    );
    const dateInSecondTransaction = await findByText(
      transactionHistoryElement,
      secondTransactionInstance.date
    );

    expect(typeInSecondTransaction).toBeInTheDocument();
    expect(descriptionInSecondTransaction).toBeInTheDocument();
    expect(amountInSecondTransaction).toBeInTheDocument();
    expect(dateInSecondTransaction).toBeInTheDocument();
  });
});
