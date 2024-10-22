import React, { useState } from 'react';
import axios from 'axios';
import './AddExpense.css'; 

const AddExpense = ({ onExpenseAdded }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const categories = ['Rent', 'Utilities', 'Groceries', 'Entertainment', 'Salary'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title === '' || amount === '' || category === '' || date === '') {
      setError('All fields are required');
      return;
    }

    try {
      const newExpense = {
        title,
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        type,
        category,
      };

      const response = await axios.post('http://localhost:5000/expenses', newExpense);

      setTitle('');
      setAmount('');
      setType('expense');
      setCategory('');
      setDate('');
      setError('');

      if (onExpenseAdded) {
        onExpenseAdded(response.data);
      }
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Failed to add expense. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Expense Title"
        />
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <label>Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">--Select a category--</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
