import api from '../api/axiosInstance.js';

export const addFood = async (foodData) => {
  try {
    const response = await api.post('/foods', foodData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding food:', error);
    throw error;
  }
};

export const getFoods = async () => {
  try {
    const response = await api.get('/foods');
    return response.data;
  } catch (error) {
    console.error('Error fetching foods:', error);
    throw error;
  }
};

export const getFoodById = async (id) => {
  try {
    const response = await api.get(`/foods/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching food with ID ${id}:`, error);
    throw error;
  }
};

export const updateFood = async (id, foodData) => {
  try {
    const response = await api.put(`/foods/${id}`, foodData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating food with ID ${id}:`, error);
    throw error;
  }
};

export const deleteFood = async (id) => {
  try {
    const response = await api.delete(`/foods/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting food with ID ${id}:`, error);
    throw error;
  }
};