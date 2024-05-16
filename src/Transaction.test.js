import Transaction from './Transaction';

describe('Transaction', () => {
  describe('^date', () => {
    it('should have the date of "15 Mei 2024, 13.08.41" constructed with date of "2024-05-15T06:08:41.408Z"', () => {
      const expectedResult = '15 Mei 2024, 13.08.41';
      const transactionDate = '2024-05-15T06:08:41.408Z';
      const transaction = new Transaction(
        1,
        transactionDate,
        100000,
        'Lorem',
        'deposit'
      );

      const actualResult = transaction.date;

      expect(actualResult).toBe(expectedResult);
    });
  });

  describe('^comparesTo', () => {
    it('should return value less than 0 when the first transaction has less amount than the second transaction', () => {
      const firstTransaction = new Transaction(
        3,
        '2024-05-03T12:30:00',
        50.25,
        'Grocery shopping',
        'withdraw'
      );
      const secondTransaction = new Transaction(
        2,
        '2024-05-04T09:00:00',
        150.5,
        'Freelance payment',
        'deposit'
      );

      const actualResult = firstTransaction.comparesTo(
        secondTransaction,
        'amount'
      );

      expect(actualResult).toBeLessThan(0);
    });

    it('should return value greater than 0 when the first transaction has bigger amount than the second transaction', () => {
      const firstTransaction = new Transaction(
        1,
        '2024-05-02T09:00:00',
        50.5,
        'Freelance payment',
        'deposit'
      );
      const secondTransaction = new Transaction(
        2,
        '2024-05-03T12:30:00',
        50.25,
        'Grocery shopping',
        'withdraw'
      );

      const actualResult = firstTransaction.comparesTo(
        secondTransaction,
        'amount'
      );

      expect(actualResult).toBeGreaterThan(0);
    });

    it('should return 0 when the first transaction has the same amount as the second transaction', () => {
      const firstTransaction = new Transaction(
        1,
        '2024-05-02T09:00:00',
        50.5,
        'Freelance payment',
        'deposit'
      );
      const secondTransaction = new Transaction(
        2,
        '2024-05-03T12:30:00',
        50.5,
        'Grocery shopping',
        'withdraw'
      );
      const expectedResult = 0;

      const actualResult = firstTransaction.comparesTo(
        secondTransaction,
        'amount'
      );

      expect(actualResult).toBe(expectedResult);
    });

    it('should return -1 when the first transaction earlier than the second transaction', () => {
      const firstTransaction = new Transaction(
        1,
        '2024-05-02T09:00:00',
        50.5,
        'Freelance payment',
        'deposit'
      );
      const secondTransaction = new Transaction(
        2,
        '2024-05-03T12:30:00',
        50.5,
        'Grocery shopping',
        'withdraw'
      );
      const expectedResult = -1;

      const actualResult = firstTransaction.comparesTo(
        secondTransaction,
        'date'
      );

      expect(actualResult).toBe(expectedResult);
    });

    it('should return -1 when the first transaction earlier if sorted based on the description than the second transaction', () => {
      const firstTransaction = new Transaction(
        1,
        '2024-05-03T12:30:00',
        50.25,
        'Grocery shopping',
        'withdraw'
      );
      const secondTransaction = new Transaction(
        2,
        '2024-05-04T09:00:00',
        150.5,
        'Freelance payment',
        'deposit'
      );
      const expectedResult = -1;

      const actualResult = firstTransaction.comparesTo(
        secondTransaction,
        'description'
      );

      expect(actualResult).toBe(expectedResult);
    });

    it('should return -1 when the first transaction compared to the second transaction and compared by an empty string (based on id)', () => {
      const firstTransaction = new Transaction(
        1,
        '2024-05-02T09:00:00',
        150.5,
        'Freelance payment',
        'deposit'
      );
      const secondTransaction = new Transaction(
        2,
        '2024-05-03T12:30:00',
        50.25,
        'Grocery shopping',
        'withdraw'
      );

      const expectedResult = -1;

      const actualResult = firstTransaction.comparesTo(secondTransaction, '');

      expect(actualResult).toBe(expectedResult);
    });
  });
});
