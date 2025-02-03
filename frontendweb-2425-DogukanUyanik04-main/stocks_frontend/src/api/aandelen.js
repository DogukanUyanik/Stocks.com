import axios from 'axios';


// Use the VITE_API_URL from the environment variables
const baseUrl = import.meta.env.VITE_API_URL + '/aandelen';


export const getAllAandelen = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
}
export const getAandeelById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};