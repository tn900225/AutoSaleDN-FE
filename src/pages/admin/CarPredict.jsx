import React, { useState, useEffect } from 'react';
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

// Base URL của Flask API
const API_URL = 'http://autosaledn.store:5050';

const CarPredictForm = () => {
    // State cho dữ liệu form
    const [formData, setFormData] = useState({
        automaker: '',
        model: '',
        year: '',
        mileage: '',
        fuelType: '',
        engineSize: '',
        transmission: '',
        condition: '',
        origin: '',
        bodyStyle: '',
    });

    // State để lưu trữ các tùy chọn lấy từ API
    const [metadata, setMetadata] = useState({
        automakers: [],
        modelsByAutomaker: {},
        fuelTypes: [],
        transmissions: [],
        conditions: [],
        origins: [],
        bodyStyles: [],
    });
    
    // State để quản lý models hiển thị trong dropdown
    const [availableModels, setAvailableModels] = useState([]);

    // Các state khác
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Lấy metadata khi component được tải lần đầu
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const response = await fetch(`${API_URL}/api/metadata`);
                if (!response.ok) throw new Error('Network response was not ok');
                
                const data = await response.json();
                const validValues = data.valid_values;

                setMetadata({
                    automakers: validValues.VALID_MAKERS || [],
                    modelsByAutomaker: validValues.VALID_MODELS || {},
                    fuelTypes: validValues.VALID_FUEL_TYPES || [],
                    transmissions: validValues.VALID_TRANSMISSIONS || [],
                    conditions: validValues.VALID_CONDITIONS || [],
                    origins: validValues.VALID_ORIGINS || [],
                    bodyStyles: validValues.VALID_BODYSTYLES || [],
                });
            } catch (err) {
                setError('Failed to load form data. Please make sure the API is running.');
                console.error("Fetch metadata error:", err);
            }
        };

        fetchMetadata();
    }, []);

    // **HÀM `handleChange` ĐÃ ĐƯỢC VIẾT LẠI ĐỂ TỐI ƯU HÓA**
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Xử lý riêng cho trường hợp thay đổi hãng xe
        if (name === 'automaker') {
            // Cập nhật hãng xe và reset model về rỗng trong một lần setState
            setFormData(prev => ({
                ...prev,
                automaker: value,
                model: '', // Reset model tại đây
            }));
            
            // Cập nhật danh sách model có sẵn dựa trên hãng xe mới
            setAvailableModels(metadata.modelsByAutomaker[value] || []);
        } else {
            // Đối với tất cả các trường input khác, chỉ cần cập nhật giá trị của chúng
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPrediction(null);

        const submissionData = {
            ...formData,
            year: parseInt(formData.year, 10),
            mileage: parseInt(formData.mileage, 10),
            engineSize: parseFloat(formData.engineSize)
        };

        try {
            const response = await fetch(`${API_URL}/api/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Prediction failed.');
            }

            const result = await response.json();
            setPrediction(result.prediction);
            setShowModal(true);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const resetForm = () => {
        setFormData({
            automaker: '', model: '', year: '', mileage: '', fuelType: '',
            engineSize: '', transmission: '', condition: '', origin: '', bodyStyle: '',
        });
        setPrediction(null);
        setError(null);
        setShowModal(false);
        setAvailableModels([]);
    };

    const closeModal = () => setShowModal(false);
    
    const formatCurrency = (value) => {
        if (value === null || isNaN(value)) return "N/A";
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };


    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminTopbar />
                <main className="p-6 sm:p-8">
                    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Car Price Prediction</h1>
                        <p className="text-gray-500 mb-8">Enter the car's details to get an estimated market price.</p>

                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">{error}</div>}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Automaker */}
                            <div className="flex flex-col">
                                <label htmlFor="automaker" className="mb-2 font-medium text-gray-700">Automaker</label>
                                <select id="automaker" name="automaker" value={formData.automaker} onChange={handleChange} required className="p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                                    <option value="">Select Automaker</option>
                                    {metadata.automakers.map(maker => <option key={maker} value={maker}>{maker}</option>)}
                                </select>
                            </div>

                            {/* Model */}
                            <div className="flex flex-col">
                                <label htmlFor="model" className="mb-2 font-medium text-gray-700">Model</label>
                                <select id="model" name="model" value={formData.model} onChange={handleChange} required disabled={!formData.automaker} className="p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-gray-200">
                                    <option value="">Select Model</option>
                                    {availableModels.map(model => <option key={model} value={model}>{model}</option>)}
                                </select>
                            </div>
                            
                            {/* Các input khác */}
                            <div>
                                <label htmlFor="year" className="mb-2 font-medium text-gray-700">Year</label>
                                <input type="number" id="year" name="year" value={formData.year} onChange={handleChange} placeholder="e.g., 2020" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"/>
                            </div>
                            <div>
                                <label htmlFor="mileage" className="mb-2 font-medium text-gray-700">Mileage (Km)</label>
                                <input type="number" id="mileage" name="mileage" value={formData.mileage} onChange={handleChange} placeholder="e.g., 50000" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"/>
                            </div>
                             <div>
                                <label htmlFor="engineSize" className="mb-2 font-medium text-gray-700">Engine Size (L)</label>
                                <input type="number" step="0.1" id="engineSize" name="engineSize" value={formData.engineSize} onChange={handleChange} placeholder="e.g., 2.0" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"/>
                            </div>
                            
                            {[
                                { name: 'fuelType', label: 'Fuel Type', options: metadata.fuelTypes },
                                { name: 'transmission', label: 'Transmission', options: metadata.transmissions },
                                { name: 'condition', label: 'Condition', options: metadata.conditions },
                                { name: 'origin', label: 'Origin', options: metadata.origins },
                                { name: 'bodyStyle', label: 'Body Style', options: metadata.bodyStyles },
                            ].map(field => (
                                <div key={field.name} className="flex flex-col">
                                    <label htmlFor={field.name} className="mb-2 font-medium text-gray-700">{field.label}</label>
                                    <select id={field.name} name={field.name} value={formData[field.name]} onChange={handleChange} required className="p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                                        <option value="">Select {field.label}</option>
                                        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            ))}

                            <div className="md:col-span-2">
                                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {loading ? 'Predicting...' : 'Get Prediction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            {/* Prediction Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full m-4">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Estimated Price</h2>
                            <div className="my-6">
                                <p className="text-5xl font-extrabold text-indigo-600">{formatCurrency(prediction)}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button onClick={resetForm} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-6 rounded-lg transition hover:opacity-90">
                                    New Prediction
                                </button>
                                <button onClick={closeModal} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition">
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

export default CarPredictForm;