import React from 'react';
import useSWR from 'swr';
import { getAllTransacties } from '../../api/transacties';

const TransactieAdmin = () => {
  const { data, error, isLoading } = useSWR('getAllTransacties', getAllTransacties);

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div>Error loading transactions: {error.message}</div>;
  }

  if (!data || data.items.length === 0) {
    return <div>No transactions available.</div>;
  }

  return (
    <div>
      <h1>All Transactions</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">User</th>
            <th scope="col">Stock</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price</th>
            <th scope="col">Transaction Type</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.gebruiker.name}</td>
              <td>{transaction.aandeel.naam}</td>
              <td>{transaction.hoeveelheid}</td>
              <td>{transaction.prijstransactie}</td>
              <td>{transaction.soorttransactie}</td>
              <td>{new Date(transaction.datum).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactieAdmin;
