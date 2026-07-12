import React from 'react'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query';
import { getFoodById } from '../../services/food.services';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/features/cartSlice';

const MenuDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  
  const { data, isPending, isError } = useQuery({
    queryKey: ["food", id],
    queryFn: () => getFoodById(id),
  });

  const food = data?.food;

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (isError || !food) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Failed to load this item.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden md:flex">
        {/* Image */}
        <div className="md:w-1/2">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {food.name}
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            {food.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold text-orange-500">
              Rs. {food.price}
            </span>
            <button onClick={() => dispatch(addItem(food))} className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-full transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuDetails
