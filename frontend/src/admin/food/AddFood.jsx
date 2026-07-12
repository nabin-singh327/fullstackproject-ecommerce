import React, { useState } from 'react';
import { addFood } from '../../services/food.services.js';

const AddFood = () => {
  const [formData, setFormData] = useState({
    foodName: '',
    foodDescription: '',
    foodPrice: '',
    foodCategory: 'appetizer'
  });
  const [foodImage, setFoodImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle text and select changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFoodImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Client-side validation
    if (!formData.foodName || !formData.foodDescription || !formData.foodPrice || !foodImage) {
      setMessage({ type: 'error', text: 'All fields, including the image, are required.' });
      return;
    }

    setLoading(true);

    // Prepare data for backend API (Multipart/Form-Data for files)
    const submissionData = new FormData();
    submissionData.append('name', formData.foodName);
    submissionData.append('description', formData.foodDescription);
    submissionData.append('price', formData.foodPrice);
    submissionData.append('category', formData.foodCategory);
    submissionData.append('image', foodImage);

    try {
      const response = await addFood(submissionData);

      if (response?.success) {
        setMessage({ type: 'success', text: 'Food item added successfully!' });
        setFormData({ foodName: '', foodDescription: '', foodPrice: '', foodCategory: 'appetizer' });
        setFoodImage(null);
        e.target.reset(); // Clears the file input field UI
      } else {
        setMessage({ type: 'error', text: response?.message || 'Failed to add food item. Try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add food item. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-150">
      <h2 className="text-xl font-bold text-gray-800 mb-5">Add New Food Item</h2>
      
      {message.text && (
        <div className={`p-3 mb-4 text-sm rounded-md border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 mb-1">
            Food Name:
          </label>
          <input 
            type="text" 
            id="foodName" 
            value={formData.foodName}
            onChange={handleChange}
            placeholder='Food Name' 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="foodDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Food Description:
          </label>
          <textarea 
            id="foodDescription" 
            value={formData.foodDescription}
            onChange={handleChange}
            placeholder='Food Description' 
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
          />
        </div>

        <div>
          <label htmlFor="foodPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Food Price:
          </label>
          <input 
            type="number" 
            id="foodPrice" 
            value={formData.foodPrice}
            onChange={handleChange}
            placeholder='Food Price' 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="foodCategory" className="block text-sm font-medium text-gray-700 mb-1">
            Food Category:
          </label>
          <select 
            id="foodCategory"
            value={formData.foodCategory}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="appetizer">Appetizer</option>
            <option value="mainCourse">Main Course</option>
            <option value="dessert">Dessert</option>
            <option value="beverage">Beverage</option>
          </select>
        </div>

        <div>
          <label htmlFor="foodImage" className="block text-sm font-medium text-gray-700 mb-1">
            Food Image:
          </label>
          <input 
            type="file" 
            id="foodImage" 
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-gray-300 rounded-md p-1 bg-white"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-md shadow-sm text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center"
        >
          {loading ? 'Adding...' : 'Add Food'}
        </button>
      </form>
    </div>
  );
};

export default AddFood;