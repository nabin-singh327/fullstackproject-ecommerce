import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query';
import { getFoods } from '../../services/food.services';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { addItem } from '../../redux/features/cartSlice';

const Menu = () => {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ["foods"],
        queryFn: getFoods,
    });



    const navigate = useNavigate();

    const items = useSelector((state) => state.cart);
    console.log("Cart items:", items);

    const dispatch = useDispatch();

    useEffect(() => {
        if (data?.message) {
            toast.success(data.message);
        }
    }, [data]);

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-sm">Loading menu...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center px-6 py-8 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 font-medium">
                        {error?.message || "Failed to load menu"}
                    </p>
                </div>
            </div>
        );
    }

    const foods = data?.foods ?? [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Menu</h1>
                <p className="text-gray-500 mt-2">Freshly made, always delicious</p>
            </div>

            {foods.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {foods.map((food) => (
                        <div
                            key={food._id}
                            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                                <img
                                    onClick={() => navigate(`/menu/${food._id}`)}
                                    src={food.image}
                                    alt={food.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {food.category && (
                                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 px-3 py-1 rounded-full">
                                        {food.category}
                                    </span>
                                )}
                            </div>

                            <div key={food._id} className="p-4 flex flex-col gap-1">
                                <div className="flex items-start justify-between gap-2">
                                    <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                                        {food.name}
                                    </h2>
                                    <span className="text-orange-600 font-bold whitespace-nowrap">
                                        Rs. {food.price}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {food.description}
                                </p>
                                <button
                                    onClick={() => dispatch(addItem(food))}
                                    className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-200 shadow-sm"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-gray-400 text-lg">No food items available</p>
                </div>
            )}
        </div>
    )
}

export default Menu