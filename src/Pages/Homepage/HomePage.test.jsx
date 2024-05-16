import axios from 'axios';
import { customers, transactions, wallets } from '../../../fixtures.json';
import {
  findAllByRole,
  findByRole,
  findByText,
  getAllByRole,
  getByRole,
  getByText,
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
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('HomePage', () => {
  describe('main feature', () => {
    beforeEach(() => {
      axios.get
        .mockResolvedValueOnce({ data: customer })
        .mockResolvedValueOnce({ data: wallet })
        .mockResolvedValue({ data: { transactions } });
    });

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

  describe('Sort', () => {
    let transactionsForSorting;

    beforeEach(() => {
      transactionsForSorting = [
        {
          id: 1,
          walletId: 1,
          date: '2024-05-02T09:00:00',
          amount: 150.5,
          description: 'Freelance payment',
          type: 'deposit'
        },
        {
          id: 2,
          walletId: 1,
          date: '2024-05-03T12:30:00',
          amount: 50.25,
          description: 'Grocery shopping',
          type: 'withdraw'
        },
        {
          id: 3,
          walletId: 1,
          date: '2024-05-04T12:30:00',
          amount: 70,
          description: 'Bonus Payment',
          type: 'deposit'
        }
      ];

      axios.get
        .mockResolvedValueOnce({ data: customer })
        .mockResolvedValueOnce({ data: wallet })
        .mockResolvedValue({ data: { transactions: transactionsForSorting } });
    });

    it('should display the second transaction, third transaction and first transaction respectively when sorting it by amount', async () => {
      render(<HomePage />);
      const user = userEvent.setup();
      const sortByValue = 'amount';
      const sortByElement = screen.getByLabelText('Sort By');
      const firstSortedTransactionIndex = 1;
      const secondSortedTransactionIndex = 2;
      const thirdSortedTransactionIndex = 0;

      await user.selectOptions(sortByElement, sortByValue);

      const TRANSACTION_HISTORY_INDEX_LIST = 1;
      const transactionHistoryElement =
        screen.getAllByRole('list')[TRANSACTION_HISTORY_INDEX_LIST];

      const firstSortedTransactionInstance = new Transaction(
        transactionsForSorting[firstSortedTransactionIndex].id,
        transactionsForSorting[firstSortedTransactionIndex].date,
        transactionsForSorting[firstSortedTransactionIndex].amount,
        transactionsForSorting[firstSortedTransactionIndex].description,
        transactionsForSorting[firstSortedTransactionIndex].type
      );
      const firstSortedTransactionElement = (
        await findAllByRole(transactionHistoryElement, 'list')
      )[0];
      const typeInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.type
      );
      const dateInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.date
      );
      const amountInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.amount
      );
      const descriptionInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.description
      );

      expect(typeInFirstSortedTransaction).toBeInTheDocument();
      expect(dateInFirstSortedTransaction).toBeInTheDocument();
      expect(amountInFirstSortedTransaction).toBeInTheDocument();
      expect(descriptionInFirstSortedTransaction).toBeInTheDocument();

      const secondSortedTransactionInstance = new Transaction(
        transactionsForSorting[secondSortedTransactionIndex].id,
        transactionsForSorting[secondSortedTransactionIndex].date,
        transactionsForSorting[secondSortedTransactionIndex].amount,
        transactionsForSorting[secondSortedTransactionIndex].description,
        transactionsForSorting[secondSortedTransactionIndex].type
      );
      const secondSortedTransactionElement = (
        await findAllByRole(transactionHistoryElement, 'list')
      )[1];
      const typeInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.type
      );
      const dateInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.date
      );
      const amountInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.amount
      );
      const descriptionInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.description
      );

      expect(typeInSecondSortedTransaction).toBeInTheDocument();
      expect(dateInSecondSortedTransaction).toBeInTheDocument();
      expect(amountInSecondSortedTransaction).toBeInTheDocument();
      expect(descriptionInSecondSortedTransaction).toBeInTheDocument();

      const thirdSortedTransactionInstance = new Transaction(
        transactionsForSorting[thirdSortedTransactionIndex].id,
        transactionsForSorting[thirdSortedTransactionIndex].date,
        transactionsForSorting[thirdSortedTransactionIndex].amount,
        transactionsForSorting[thirdSortedTransactionIndex].description,
        transactionsForSorting[thirdSortedTransactionIndex].type
      );
      const thirdSortedTransactionElement = (
        await findAllByRole(transactionHistoryElement, 'list')
      )[2];
      const typeInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.type
      );
      const dateInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.date
      );
      const amountInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.amount
      );
      const descriptionInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.description
      );

      expect(typeInThirdSortedTransaction).toBeInTheDocument();
      expect(dateInThirdSortedTransaction).toBeInTheDocument();
      expect(amountInThirdSortedTransaction).toBeInTheDocument();
      expect(descriptionInThirdSortedTransaction).toBeInTheDocument();
    });

    it('should display the third transaction, first transaction and second transaction respectively when sorting it by description', async () => {
      render(<HomePage />);
      const user = userEvent.setup();
      const sortByValue = 'description';
      const sortByElement = screen.getByLabelText('Sort By');
      const firstSortedTransactionIndex = 2;
      const secondSortedTransactionIndex = 0;
      const thirdSortedTransactionIndex = 1;

      await user.selectOptions(sortByElement, sortByValue);

      const TRANSACTION_HISTORY_INDEX_LIST = 1;
      const transactionHistoryElement =
        screen.getAllByRole('list')[TRANSACTION_HISTORY_INDEX_LIST];

      const firstSortedTransactionInstance = new Transaction(
        transactionsForSorting[firstSortedTransactionIndex].id,
        transactionsForSorting[firstSortedTransactionIndex].date,
        transactionsForSorting[firstSortedTransactionIndex].amount,
        transactionsForSorting[firstSortedTransactionIndex].description,
        transactionsForSorting[firstSortedTransactionIndex].type
      );
      const firstSortedTransactionElement = (
        await findAllByRole(transactionHistoryElement, 'list')
      )[0];
      const typeInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.type
      );
      const dateInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.date
      );
      const amountInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.amount
      );
      const descriptionInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.description
      );

      expect(typeInFirstSortedTransaction).toBeInTheDocument();
      expect(dateInFirstSortedTransaction).toBeInTheDocument();
      expect(amountInFirstSortedTransaction).toBeInTheDocument();
      expect(descriptionInFirstSortedTransaction).toBeInTheDocument();

      const secondSortedTransactionInstance = new Transaction(
        transactionsForSorting[secondSortedTransactionIndex].id,
        transactionsForSorting[secondSortedTransactionIndex].date,
        transactionsForSorting[secondSortedTransactionIndex].amount,
        transactionsForSorting[secondSortedTransactionIndex].description,
        transactionsForSorting[secondSortedTransactionIndex].type
      );
      const secondSortedTransactionElement = (
        await findAllByRole(transactionHistoryElement, 'list')
      )[1];
      const typeInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.type
      );
      const dateInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.date
      );
      const amountInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.amount
      );
      const descriptionInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.description
      );

      expect(typeInSecondSortedTransaction).toBeInTheDocument();
      expect(dateInSecondSortedTransaction).toBeInTheDocument();
      expect(amountInSecondSortedTransaction).toBeInTheDocument();
      expect(descriptionInSecondSortedTransaction).toBeInTheDocument();

      const thirdSortedTransactionInstance = new Transaction(
        transactionsForSorting[thirdSortedTransactionIndex].id,
        transactionsForSorting[thirdSortedTransactionIndex].date,
        transactionsForSorting[thirdSortedTransactionIndex].amount,
        transactionsForSorting[thirdSortedTransactionIndex].description,
        transactionsForSorting[thirdSortedTransactionIndex].type
      );
      const thirdSortedTransactionElement = (
        await findAllByRole(transactionHistoryElement, 'list')
      )[2];
      const typeInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.type
      );
      const dateInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.date
      );
      const amountInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.amount
      );
      const descriptionInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.description
      );

      expect(typeInThirdSortedTransaction).toBeInTheDocument();
      expect(dateInThirdSortedTransaction).toBeInTheDocument();
      expect(amountInThirdSortedTransaction).toBeInTheDocument();
      expect(descriptionInThirdSortedTransaction).toBeInTheDocument();
    });

    it('should display the first transaction, second transaction and third transaction respectively when sorting it by date and previously was sorting by amount', async () => {
      render(<HomePage />);
      const user = userEvent.setup();
      const sortByValue = 'date';
      const sortByElement = screen.getByLabelText('Sort By');
      const firstSortedTransactionIndex = 0;
      const secondSortedTransactionIndex = 1;
      const thirdSortedTransactionIndex = 2;
      await user.selectOptions(sortByElement, 'amount');

      await user.selectOptions(sortByElement, sortByValue);

      const TRANSACTION_HISTORY_INDEX_LIST = 1;
      const transactionHistoryElement =
        screen.getAllByRole('list')[TRANSACTION_HISTORY_INDEX_LIST];

      const firstSortedTransactionInstance = new Transaction(
        transactionsForSorting[firstSortedTransactionIndex].id,
        transactionsForSorting[firstSortedTransactionIndex].date,
        transactionsForSorting[firstSortedTransactionIndex].amount,
        transactionsForSorting[firstSortedTransactionIndex].description,
        transactionsForSorting[firstSortedTransactionIndex].type
      );
      const firstSortedTransactionElement = (
        await findAllByRole(transactionHistoryElement, 'list')
      )[0];
      const typeInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.type
      );
      const dateInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.date
      );
      const amountInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.amount
      );
      const descriptionInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.description
      );

      expect(typeInFirstSortedTransaction).toBeInTheDocument();
      expect(dateInFirstSortedTransaction).toBeInTheDocument();
      expect(amountInFirstSortedTransaction).toBeInTheDocument();
      expect(descriptionInFirstSortedTransaction).toBeInTheDocument();

      const secondSortedTransactionInstance = new Transaction(
        transactionsForSorting[secondSortedTransactionIndex].id,
        transactionsForSorting[secondSortedTransactionIndex].date,
        transactionsForSorting[secondSortedTransactionIndex].amount,
        transactionsForSorting[secondSortedTransactionIndex].description,
        transactionsForSorting[secondSortedTransactionIndex].type
      );
      const secondSortedTransactionElement = (
        await findAllByRole(transactionHistoryElement, 'list')
      )[1];
      const typeInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.type
      );
      const dateInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.date
      );
      const amountInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.amount
      );
      const descriptionInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.description
      );

      expect(typeInSecondSortedTransaction).toBeInTheDocument();
      expect(dateInSecondSortedTransaction).toBeInTheDocument();
      expect(amountInSecondSortedTransaction).toBeInTheDocument();
      expect(descriptionInSecondSortedTransaction).toBeInTheDocument();

      const thirdSortedTransactionInstance = new Transaction(
        transactionsForSorting[thirdSortedTransactionIndex].id,
        transactionsForSorting[thirdSortedTransactionIndex].date,
        transactionsForSorting[thirdSortedTransactionIndex].amount,
        transactionsForSorting[thirdSortedTransactionIndex].description,
        transactionsForSorting[thirdSortedTransactionIndex].type
      );
      const thirdSortedTransactionElement = (
        await findAllByRole(transactionHistoryElement, 'list')
      )[2];
      const typeInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.type
      );
      const dateInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.date
      );
      const amountInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.amount
      );
      const descriptionInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.description
      );

      expect(typeInThirdSortedTransaction).toBeInTheDocument();
      expect(dateInThirdSortedTransaction).toBeInTheDocument();
      expect(amountInThirdSortedTransaction).toBeInTheDocument();
      expect(descriptionInThirdSortedTransaction).toBeInTheDocument();
    });

    it('should display the first transaction, third transaction and second transaction respectively when sorting it by amount and sorting it descending', async () => {
      render(<HomePage />);
      const user = userEvent.setup();
      const sortByValue = 'amount';
      const sortOrderValue = 'descending';
      const sortByElement = screen.getByLabelText('Sort By');
      const sortOrderElement = screen.getByLabelText('Sort Order');
      const firstSortedTransactionIndex = 0;
      const secondSortedTransactionIndex = 2;
      const thirdSortedTransactionIndex = 1;

      await user.selectOptions(sortByElement, sortByValue);
      await user.selectOptions(sortOrderElement, sortOrderValue);

      const TRANSACTION_HISTORY_INDEX_LIST = 1;
      const transactionHistoryElement =
        screen.getAllByRole('list')[TRANSACTION_HISTORY_INDEX_LIST];

      const firstSortedTransactionInstance = new Transaction(
        transactionsForSorting[firstSortedTransactionIndex].id,
        transactionsForSorting[firstSortedTransactionIndex].date,
        transactionsForSorting[firstSortedTransactionIndex].amount,
        transactionsForSorting[firstSortedTransactionIndex].description,
        transactionsForSorting[firstSortedTransactionIndex].type
      );
      const firstSortedTransactionElement = (
        await findAllByRole(transactionHistoryElement, 'list')
      )[0];
      const typeInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.type
      );
      const dateInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.date
      );
      const amountInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.amount
      );
      const descriptionInFirstSortedTransaction = getByText(
        firstSortedTransactionElement,
        firstSortedTransactionInstance.description
      );

      expect(typeInFirstSortedTransaction).toBeInTheDocument();
      expect(dateInFirstSortedTransaction).toBeInTheDocument();
      expect(amountInFirstSortedTransaction).toBeInTheDocument();
      expect(descriptionInFirstSortedTransaction).toBeInTheDocument();

      const secondSortedTransactionInstance = new Transaction(
        transactionsForSorting[secondSortedTransactionIndex].id,
        transactionsForSorting[secondSortedTransactionIndex].date,
        transactionsForSorting[secondSortedTransactionIndex].amount,
        transactionsForSorting[secondSortedTransactionIndex].description,
        transactionsForSorting[secondSortedTransactionIndex].type
      );
      const secondSortedTransactionElement = (
        await findAllByRole(transactionHistoryElement, 'list')
      )[1];
      const typeInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.type
      );
      const dateInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.date
      );
      const amountInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.amount
      );
      const descriptionInSecondSortedTransaction = getByText(
        secondSortedTransactionElement,
        secondSortedTransactionInstance.description
      );

      expect(typeInSecondSortedTransaction).toBeInTheDocument();
      expect(dateInSecondSortedTransaction).toBeInTheDocument();
      expect(amountInSecondSortedTransaction).toBeInTheDocument();
      expect(descriptionInSecondSortedTransaction).toBeInTheDocument();

      const thirdSortedTransactionInstance = new Transaction(
        transactionsForSorting[thirdSortedTransactionIndex].id,
        transactionsForSorting[thirdSortedTransactionIndex].date,
        transactionsForSorting[thirdSortedTransactionIndex].amount,
        transactionsForSorting[thirdSortedTransactionIndex].description,
        transactionsForSorting[thirdSortedTransactionIndex].type
      );
      const thirdSortedTransactionElement = (
        await findAllByRole(transactionHistoryElement, 'list')
      )[2];
      const typeInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.type
      );
      const dateInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.date
      );
      const amountInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.amount
      );
      const descriptionInThirdSortedTransaction = getByText(
        thirdSortedTransactionElement,
        thirdSortedTransactionInstance.description
      );

      expect(typeInThirdSortedTransaction).toBeInTheDocument();
      expect(dateInThirdSortedTransaction).toBeInTheDocument();
      expect(amountInThirdSortedTransaction).toBeInTheDocument();
      expect(descriptionInThirdSortedTransaction).toBeInTheDocument();
    });
  });
});
