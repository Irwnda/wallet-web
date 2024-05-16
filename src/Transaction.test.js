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

      const actualResult = firstTransaction.comparesTo(secondTransaction);

      expect(actualResult).toBeLessThan(0);
    });
  });
});
