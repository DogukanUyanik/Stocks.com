import React, { useState } from 'react';
import useSWR from 'swr';
import { getAllGebruikers, deleteGebruikerById } from '../api/gebruikers';

const DeleteUsers = () => {
  const { data: gebruikers, error, mutate } = useSWR(
    'getAllGebruikers',
    getAllGebruikers
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setIsDeleting(true);
        await deleteGebruikerById(id);
        mutate(); 
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (error) {
    return <div className="alert alert-danger">Error loading gebruikers: {error.message}</div>;
  }

  if (!gebruikers) {
    return <div className="alert alert-info">Loading gebruikers...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Delete Users</h2>
      {gebruikers.length === 0 ? (
        <p>No users available.</p>
      ) : (
        <ul className="list-group">
          {gebruikers.map((gebruiker) => (
            <li key={gebruiker.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                {gebruiker.name} ({gebruiker.email})
              </span>
              <button
                onClick={() => handleDelete(gebruiker.id)}
                className="btn btn-danger btn-sm"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeleteUsers;
