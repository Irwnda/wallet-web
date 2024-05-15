import TransactionDate from './TransactionDate';

describe('TransactionDate', () => {
  describe('^date', () => {
    it('should have the date of "15 Mei 2024, 13.08.41" constructed with date of "2024-05-15T06:08:41.408Z"', () => {
      const expectedResult = '15 Mei 2024, 13.08.41';
      const transactionDate = '2024-05-15T06:08:41.408Z';
      const transaction = new TransactionDate(transactionDate);

      const actualResult = `${transaction}`;

      expect(actualResult).toBe(expectedResult);
    });
  });
});
