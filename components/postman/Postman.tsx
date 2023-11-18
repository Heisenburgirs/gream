import axios from 'axios';

export const fetchTwitterAddress = async () => {
  try {
    const API_ENDPOINT = 'https://paymagicapi.com/v1/';
    const response = await axios.get(API_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};
