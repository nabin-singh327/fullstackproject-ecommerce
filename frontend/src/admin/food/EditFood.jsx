import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getFoodById, updateFood } from '../../services/food.services.js';

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    foodName: '',
    foodDescription: '',
    foodPrice: '',
    foodCategory: 'appetizer',
  });
  const [foodImage, setFoodImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingFood, setLoadingFood] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadFood = async () => {
      try {
        const response = await getFoodById(id);
        if (response?.success) {
          const food = response.food;
          setFormData({
            foodName: food.name,
            foodDescription: food.description,
            foodPrice: food.price,
            foodCategory: food.category,
          });
        } else {
          setMessage({ type: 'error', text: response?.message || 'Food item not found.' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: error.response?.data?.message || 'Unable to load food item.' });
      } finally {
        setLoadingFood(false);
      }
    };

    loadFood();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFoodImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.foodName || !formData.foodDescription || !formData.foodPrice) {
      setMessage({ type: 'error', text: 'Name, description, and price are required.' });
      return;
    }

    const submissionData = new FormData();
    submissionData.append('name', formData.foodName);
    submissionData.append('description', formData.foodDescription);
    submissionData.append('price', formData.foodPrice);
    submissionData.append('category', formData.foodCategory);
    if (foodImage) {
      submissionData.append('image', foodImage);
    }

    setLoading(true);
    try {
      const response = await updateFood(id, submissionData);
      if (response?.success) {
        setMessage({ type: 'success', text: 'Food item updated successfully.' });
        setTimeout(() => navigate('/admin/food-management'), 800);
      } else {
        setMessage({ type: 'error', text: response?.message || 'Failed to update food item.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update food item.' });
    } finally {
      setLoading(false);
    }
  };

  if (loadingFood) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="text-sm font-medium text-gray-500 mt-3">Loading menu item...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-150">
      <h2 className="text-xl font-bold text-gray-800 mb-5">Edit Food Item</h2>

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            Replace Image:
          </label>
          <input
            type="file"
            id="foodImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-gray-300 rounded-md p-1 bg-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-md shadow-sm text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/food-management')}
            className="flex-1 py-2.5 px-4 border border-gray-300 bg-white text-gray-700 font-medium rounded-md shadow-sm text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFood;
