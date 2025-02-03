import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL + '/transacties';


export const getAllTransacties = async () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('User is not authenticated. Please log in.');
  }

  try {
    const response = await axios.get(`${baseUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions.');
  }
};

export const buyTransaction = async (transactionData) => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('User is not authenticated. Please log in.');
  }
  const response = await axios.post(
    `${baseUrl}/buy`,
    transactionData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


export const sellTransaction = async (transactionData) => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('User is not authenticated. Please log in.');
  }

  const response = await axios.post(
    `${baseUrl}/sell`,
    transactionData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

