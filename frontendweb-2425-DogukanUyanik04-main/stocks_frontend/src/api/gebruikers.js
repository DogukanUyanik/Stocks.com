import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL + '/gebruikers';

// Fetch all gebruikers (users)
export const getAllGebruikers = async () => {
  try {
    const token = localStorage.getItem('jwtToken'); 
    if (!token) {
      throw new Error('User is not authenticated. Please log in.');
    }

    const response = await axios.get(baseUrl, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};


export const fetchLeaderboardData = async () => {
  try {
    const response = await fetch(baseUrl + '/leaderboardpagina');
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }
    const data = await response.json();
    return data.items;  
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];  
  }
};

export const createGebruiker = async (gebruiker) => {
  try {
    console.log('Sending request to create gebruiker:', gebruiker);
    const response = await axios.post(baseUrl, gebruiker);
    console.log('Response from server:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating gebruiker:", error);
    if (error.response) {
      console.error('Error Response:', error.response.data);
      console.error('Error Status:', error.response.status);
    } else {
      console.error('Error Message:', error.message);
    }
    throw error;
  }
};

export const deleteGebruikerById = async (id) => {
  try {
    const token = localStorage.getItem('jwtToken'); 
    const response = await axios.delete(`${baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error deleting gebruiker:", error);
    throw error;
  }
};


export const fetcher = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data.portfolio || {};  
  } catch (error) {
    console.error("Error fetching data from", url, error);
    throw error; 
  }
};

export const getBalanceById = async (id) => {
  try {
    const token = localStorage.getItem('jwtToken'); 
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.get(`${baseUrl}/${id}/balance`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    return response.data.balance; 
  } catch (error) {
    console.error("Error fetching balance for user:", error);
    return null;  
  }
};




export const getUserStocks = async () => {
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    throw new Error('User is not authenticated. Please log in.');
  }

  const response = await axios.get(
    `${baseUrl}/user/stocks`, 
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );

  return response.data;
};








