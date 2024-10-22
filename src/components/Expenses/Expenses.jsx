import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddExpense from '../AddExpense/AddExpense';
import './Expenses.css'; 

const Expenses = () => {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('date'); // Sort by date, title, or amount
  const [selectedEntry, setSelectedEntry] = useState(null); // For editing an entry

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/expenses');
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleExpenseAdded = async (newEntry) => {
    try {
      const response = await axios.post('http://localhost:5000/expenses', newEntry);
      setEntries((prevEntries) => [...prevEntries, response.data]);
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const handleEditEntry = async (updatedEntry) => {
    try {
      const response = await axios.put(`http://localhost:5000/expenses/${updatedEntry.id}`, updatedEntry);
      setEntries((prevEntries) =>
        prevEntries.map(entry => (entry.id === updatedEntry.id ? response.data : entry))
      );
      setSelectedEntry(null); // Clear selected entry after editing
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const deleteEntry = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await axios.delete(`http://localhost:5000/expenses/${id}`);
        setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const deleteAllEntries = async () => {
    if (window.confirm("Are you sure you want to delete all entries?")) {
      try {
        await axios.delete('http://localhost:5000/expenses');
        setEntries([]);
      } catch (error) {
        console.error('Error deleting all entries:', error);
      }
    }
  };

  // Filter and search logic
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || entry.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Sorting logic
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortField === 'amount') {
      return a.amount - b.amount; // Sort by amount
    } else if (sortField === 'title') {
      return a.title.localeCompare(b.title); // Sort by title
    }
    return new Date(a.date) - new Date(b.date); // Default sort by date
  });

  // Calculate total amounts
  const totalIncome = entries
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = entries
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);
  
  return (
    <div>
      <h1>Income and Expenses</h1>

      <AddExpense onExpenseAdded={handleExpenseAdded} selectedEntry={selectedEntry} onEditEntry={handleEditEntry} />

      <button onClick={deleteAllEntries} style={{ marginBottom: '10px' }}>
        Delete All Entries
      </button>

      <div>
        <input
          type="text"
          placeholder="Search by Title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={sortField} onChange={(e) => setSortField(e.target.value)} style={{ marginLeft: '10px' }}>
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="title">Title</option>
        </select>
      </div>

      <h2>Total Income: ${totalIncome}</h2>
      <h2>Total Expenses: ${totalExpenses}</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.id}</td>
              <td>{entry.title}</td>
              <td>${entry.amount}</td>
              <td>{new Date(entry.date).toLocaleDateString()}</td>
              <td>{entry.type}</td>
              <td>{entry.category}</td>
              <td>
              
                <button onClick={() => deleteEntry(entry.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Expenses;
