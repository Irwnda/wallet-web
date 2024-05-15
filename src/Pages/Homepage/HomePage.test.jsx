import axios from 'axios';
import { customers } from '../../../fixtures.json';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';
import { BACKEND_URL, CUSTOMER_ID } from '../../constants';

jest.mock('axios');

afterEach(() => {
  jest.resetAllMocks();
});

describe('HomePage', () => {
  it('should display greetings on homepage and "Hello," text', async () => {
    const customer = customers.find((customer) => customer.id === CUSTOMER_ID);
    axios.get = jest.fn().mockResolvedValue({ data: customer });
    render(<HomePage />);
    const helloTextElement = screen.getByText('Hello,');
    const greetingElement = await screen.findByRole('heading', {
      level: 1,
      name: customer.name
    });

    expect(helloTextElement).toBeInTheDocument();
    expect(greetingElement).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `${BACKEND_URL}/customers/${CUSTOMER_ID}`
    );
  });
});
