import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/Homepage/HomePage';
import TransactionForm from './Pages/TransactionForm/TransactionForm';

const App = () => (
  <>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/transaction-form">Transaction Form</Link>
    </nav>
    <div className="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/transaction-form" element={<TransactionForm />} />
      </Routes>
    </div>
  </>
);

export default App;
