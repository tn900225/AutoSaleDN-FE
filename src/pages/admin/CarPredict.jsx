import React, { useState } from 'react';
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const CarInfoForm = () => {
    const [formData, setFormData] = useState({
        year: '',
        transmission: '',
        mileage: '',
        fuelType: '',
        tax: '',
        mpg: '',
        engineSize: '',
        model: '',
        automaker: ''
    });

    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(null);

    // Tooltip content for each field
    const tooltips = {
        year: "The manufacturing year of the car (e.g., 2020). Newer cars generally have higher values.",
        transmission: "Type of transmission system. Automatic transmissions are often preferred and may affect pricing.",
        mileage: "Total distance the car has traveled in miles. Lower mileage typically means higher value.",
        fuelType: "Type of fuel the car uses. Hybrid vehicles often retain value better due to fuel efficiency.",
        tax: "Annual road tax in British Pounds (£). Lower tax usually indicates more efficient/smaller engines.",
        mpg: "Miles Per Gallon - fuel efficiency rating. Higher MPG means better fuel economy and lower running costs.",
        engineSize: "Engine displacement in liters. Larger engines typically provide more power but consume more fuel.",
        model: "Specific model name of the car (e.g., A4, Focus, Civic). Different models have varying market values.",
        automaker: "The car manufacturer/brand. Luxury brands like BMW, Audi, Mercedes typically hold value better."
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const requiredFields = ['year', 'transmission', 'mileage', 'fuelType', 'tax', 'mpg', 'engineSize', 'model', 'automaker'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError(null);
        setPrediction(null);

        try {
            const response = await fetch('https://autosaledn.store/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    year: parseInt(formData.year),
                    mileage: parseInt(formData.mileage),
                    tax: parseFloat(formData.tax),
                    mpg: parseFloat(formData.mpg),
                    engineSize: parseFloat(formData.engineSize)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setPrediction(result);
            setShowModal(true);
        } catch (err) {
            setError('An error occurred while making the prediction. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setPrediction(null);
    };

    const resetForm = () => {
        setFormData({
            year: '',
            transmission: '',
            mileage: '',
            fuelType: '',
            tax: '',
            mpg: '',
            engineSize: '',
            model: '',
            automaker: ''
        });
        setError(null);
        closeModal();
    };

    const showTooltip = (field) => {
        setTooltipVisible(field);
    };

    const hideTooltip = () => {
        setTooltipVisible(null);
    };

    return (
        <div className="flex flex-col h-screen">
            <AdminTopbar />
            <div className="flex flex-1">
                <AdminSidebar />
                <div className="flex-1 p-4 md:p-8 overflow-auto bg-gray-100">
                    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Car Price Prediction</h1>
                                <p className="text-gray-600">Enter your car details to get an estimated price</p>
                            </div>

                            {/* Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Automaker */}
                                <div className="space-y-2 md:col-span-2 relative">
                                    <div className="flex items-center">
                                        <label htmlFor="automaker" className="block text-sm font-medium text-gray-700">
                                            Automaker *
                                        </label>
                                        <div className="relative ml-2">
                                            <svg
                                                className="w-4 h-4 text-gray-400 cursor-help"
                                                onMouseEnter={() => showTooltip('automaker')}
                                                onMouseLeave={hideTooltip}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                            {tooltipVisible === 'automaker' && (
                                                <div className="absolute z-10 left-6 top-0 w-64 p-3 text-xs text-white bg-gray-800 rounded-lg shadow-lg">
                                                    {tooltips.automaker}
                                                    <div className="absolute top-2 -left-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <select
                                        name="automaker"
                                        id="automaker"
                                        value={formData.automaker}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    >
                                        <option value="">Select automaker</option>
                                        <option value="audi">Audi</option>
                                        <option value="bmw">BMW</option>
                                        <option value="focus">Focus</option>
                                        <option value="ford">Ford</option>
                                        <option value="hyundi">Hyundai</option>
                                        <option value="merc">Mercedes</option>
                                        <option value="skoda">Skoda</option>
                                        <option value="toyota">Toyota</option>
                                        <option value="vauxhall">Vauxhall</option>
                                        <option value="vw">Volkswagen</option>
                                    </select>
                                </div>

                                {/* Year */}
                                <div className="space-y-2 relative">
                                    <div className="flex items-center">
                                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                                            Year *
                                        </label>
                                        <div className="relative ml-2">
                                            <svg
                                                className="w-4 h-4 text-gray-400 cursor-help"
                                                onMouseEnter={() => showTooltip('year')}
                                                onMouseLeave={hideTooltip}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                            {tooltipVisible === 'year' && (
                                                <div className="absolute z-10 left-6 top-0 w-64 p-3 text-xs text-white bg-gray-800 rounded-lg shadow-lg">
                                                    {tooltips.year}
                                                    <div className="absolute top-2 -left-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="number"
                                        name="year"
                                        id="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 2020"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>

                                {/* Transmission */}
                                <div className="space-y-2 relative">
                                    <div className="flex items-center">
                                        <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">
                                            Transmission *
                                        </label>
                                        <div className="relative ml-2">
                                            <svg
                                                className="w-4 h-4 text-gray-400 cursor-help"
                                                onMouseEnter={() => showTooltip('transmission')}
                                                onMouseLeave={hideTooltip}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                            {tooltipVisible === 'transmission' && (
                                                <div className="absolute z-10 left-6 top-0 w-64 p-3 text-xs text-white bg-gray-800 rounded-lg shadow-lg">
                                                    {tooltips.transmission}
                                                    <div className="absolute top-2 -left-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <select
                                        name="transmission"
                                        id="transmission"
                                        value={formData.transmission}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    >
                                        <option value="">Select transmission</option>
                                        <option value="Automatic">Automatic</option>
                                        <option value="Manual">Manual</option>
                                        <option value="Semi-Auto">Semi-Automatic</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Mileage */}
                                <div className="space-y-2 relative">
                                    <div className="flex items-center">
                                        <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
                                            Mileage *
                                        </label>
                                        <div className="relative ml-2">
                                            <svg
                                                className="w-4 h-4 text-gray-400 cursor-help"
                                                onMouseEnter={() => showTooltip('mileage')}
                                                onMouseLeave={hideTooltip}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                            {tooltipVisible === 'mileage' && (
                                                <div className="absolute z-10 left-6 top-0 w-64 p-3 text-xs text-white bg-gray-800 rounded-lg shadow-lg">
                                                    {tooltips.mileage}
                                                    <div className="absolute top-2 -left-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="number"
                                        name="mileage"
                                        id="mileage"
                                        value={formData.mileage}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 25000"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>

                                {/* FuelType */}
                                <div className="space-y-2 relative">
                                    <div className="flex items-center">
                                        <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">
                                            Fuel Type *
                                        </label>
                                        <div className="relative ml-2">
                                            <svg
                                                className="w-4 h-4 text-gray-400 cursor-help"
                                                onMouseEnter={() => showTooltip('fuelType')}
                                                onMouseLeave={hideTooltip}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                            {tooltipVisible === 'fuelType' && (
                                                <div className="absolute z-10 left-6 top-0 w-64 p-3 text-xs text-white bg-gray-800 rounded-lg shadow-lg">
                                                    {tooltips.fuelType}
                                                    <div className="absolute top-2 -left-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <select
                                        name="fuelType"
                                        id="fuelType"
                                        value={formData.fuelType}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    >
                                        <option value="">Select fuel type</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Hybrid">Hybrid</option>
                                        <option value="Petrol">Petrol</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Tax */}
                                <div className="space-y-2 relative">
                                    <div className="flex items-center">
                                        <label htmlFor="tax" className="block text-sm font-medium text-gray-700">
                                            Tax (£) *
                                        </label>
                                        <div className="relative ml-2">
                                            <svg
                                                className="w-4 h-4 text-gray-400 cursor-help"
                                                onMouseEnter={() => showTooltip('tax')}
                                                onMouseLeave={hideTooltip}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                            {tooltipVisible === 'tax' && (
                                                <div className="absolute z-10 left-6 top-0 w-64 p-3 text-xs text-white bg-gray-800 rounded-lg shadow-lg">
                                                    {tooltips.tax}
                                                    <div className="absolute top-2 -left-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="tax"
                                        id="tax"
                                        value={formData.tax}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 150"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>

                                {/* MPG */}
                                <div className="space-y-2 relative">
                                    <div className="flex items-center">
                                        <label htmlFor="mpg" className="block text-sm font-medium text-gray-700">
                                            MPG *
                                        </label>
                                        <div className="relative ml-2">
                                            <svg
                                                className="w-4 h-4 text-gray-400 cursor-help"
                                                onMouseEnter={() => showTooltip('mpg')}
                                                onMouseLeave={hideTooltip}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                            {tooltipVisible === 'mpg' && (
                                                <div className="absolute z-10 left-6 top-0 w-64 p-3 text-xs text-white bg-gray-800 rounded-lg shadow-lg">
                                                    {tooltips.mpg}
                                                    <div className="absolute top-2 -left-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="mpg"
                                        id="mpg"
                                        value={formData.mpg}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 45.6"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>

                                {/* Engine Size */}
                                <div className="space-y-2 relative">
                                    <div className="flex items-center">
                                        <label htmlFor="engineSize" className="block text-sm font-medium text-gray-700">
                                            Engine Size (L) *
                                        </label>
                                        <div className="relative ml-2">
                                            <svg
                                                className="w-4 h-4 text-gray-400 cursor-help"
                                                onMouseEnter={() => showTooltip('engineSize')}
                                                onMouseLeave={hideTooltip}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                            {tooltipVisible === 'engineSize' && (
                                                <div className="absolute z-10 left-6 top-0 w-64 p-3 text-xs text-white bg-gray-800 rounded-lg shadow-lg">
                                                    {tooltips.engineSize}
                                                    <div className="absolute top-2 -left-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="engineSize"
                                        id="engineSize"
                                        value={formData.engineSize}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 1.6"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>

                                {/* Model */}
                                <div className="space-y-2 relative">
                                    <div className="flex items-center">
                                        <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                                            Model *
                                        </label>
                                        <div className="relative ml-2">
                                            <svg
                                                className="w-4 h-4 text-gray-400 cursor-help"
                                                onMouseEnter={() => showTooltip('model')}
                                                onMouseLeave={hideTooltip}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                            {tooltipVisible === 'model' && (
                                                <div className="absolute z-10 left-6 top-0 w-64 p-3 text-xs text-white bg-gray-800 rounded-lg shadow-lg">
                                                    {tooltips.model}
                                                    <div className="absolute top-2 -left-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        name="model"
                                        id="model"
                                        value={formData.model}
                                        onChange={handleInputChange}
                                        placeholder="e.g. A4, Focus, Civic"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center mt-8">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-8 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 disabled:transform-none"
                                >
                                    {loading ? (
                                        <div className="flex items-center space-x-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Predicting...</span>
                                        </div>
                                    ) : (
                                        'Get Price Prediction'
                                    )}
                                </button>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <h3 className="font-medium">Error</h3>
                                            <p className="mt-1 text-sm">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
            {/* Modal */}
            {showModal && prediction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Price Prediction Results</h3>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 transition duration-200"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            {/* Car Details Summary */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-gray-800 mb-3">Car Details</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><span className="text-gray-600">Make:</span> <span className="font-medium">{formData.automaker.charAt(0).toUpperCase() + formData.automaker.slice(1)}</span></div>
                                    <div><span className="text-gray-600">Model:</span> <span className="font-medium">{formData.model}</span></div>
                                    <div><span className="text-gray-600">Year:</span> <span className="font-medium">{formData.year}</span></div>
                                    <div><span className="text-gray-600">Mileage:</span> <span className="font-medium">{parseInt(formData.mileage).toLocaleString()}</span></div>
                                    <div><span className="text-gray-600">Fuel:</span> <span className="font-medium">{formData.fuelType}</span></div>
                                    <div><span className="text-gray-600">Transmission:</span> <span className="font-medium">{formData.transmission}</span></div>
                                </div>
                            </div>

                            {/* Price Results */}
                            <div className="space-y-4 mb-6">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                                    <h4 className="font-semibold text-green-800 mb-4">Estimated Price</h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-white rounded-lg p-4 border border-green-100">
                                            <p className="text-sm text-gray-600 mb-1">Price in GBP</p>
                                            <p className="text-3xl font-bold text-green-700">£{prediction.predicted_price_gbp?.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-green-100">
                                            <p className="text-sm text-gray-600 mb-1">Price in VND</p>
                                            <p className="text-3xl font-bold text-green-700">{prediction.predicted_price_vnd} VND</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Technical Details
                            <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-blue-800 mb-3">Technical Details</h4>
                                <div className="text-sm text-blue-700 space-y-1">
                                    <p><span className="font-medium">Model used:</span> {prediction.model_used}</p>
                                    <p><span className="font-medium">Exchange rate:</span> {prediction.exchange_rate}</p>
                                </div>
                            </div> */}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    onClick={resetForm}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    New Prediction
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarInfoForm;