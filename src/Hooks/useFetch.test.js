import { BACKEND_URL, CUSTOMER_ID } from '../constants';
import { customers } from '../../fixtures.json';
import axios from 'axios';
import { renderHook, waitFor } from '@testing-library/react';
import useFetch from './useFetch';

jest.mock('axios');

let customer;

beforeEach(() => {
  customer = customers.find((customer) => customer.id === CUSTOMER_ID);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useFetch', () => {
  it('should return customer with id is 1', async () => {
    axios.get.mockResolvedValue({ data: customer });
    const { result } = await waitFor(() =>
      renderHook(() => useFetch('customers', CUSTOMER_ID))
    );
    const { fetchedData: actualCustomer } = result.current;

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `${BACKEND_URL}/customers/${CUSTOMER_ID}`
    );
    expect(actualCustomer).toEqual(customer);
  });
});
