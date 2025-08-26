import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import {
    FaPlus,
    FaEdit,
    FaToggleOn,
    FaToggleOff,
    FaTimes, // Keeping FaTimes for general use if needed elsewhere, but removing for delete actions
    FaSearch,
    FaSpinner,
    FaBuilding, // Icon for Manufacturer
    FaCarAlt,   // Icon for Car Model
    FaFilter,
    FaChevronDown,
    FaChevronUp,
    FaSortAlphaDown,
    FaSortAlphaUp,
    FaCheck,
    FaBan,
    FaChevronLeft,
    FaChevronRight,
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
    FaListAlt, // Icon to view models
} from "react-icons/fa";

export default function CarManufacturersAndModelsManagementPage() {
    // Manufacturer States
    const [manufacturers, setManufacturers] = useState([]);
    const [filteredManufacturers, setFilteredManufacturers] = useState([]);
    const [showManufacturerModal, setShowManufacturerModal] = useState(false);
    const [currentManufacturer, setCurrentManufacturer] = useState(null);
    const [manufacturerNameInput, setManufacturerNameInput] = useState("");

    // Model States
    const [models, setModels] = useState([]); // All models
    const [filteredModels, setFilteredModels] = useState([]); // Models filtered by selected manufacturer
    const [selectedManufacturer, setSelectedManufacturer] = useState(null); // The manufacturer whose models are currently being viewed

    // Common States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination for Manufacturers
    const [currentPageManufacturers, setCurrentPageManufacturers] = useState(1);
    const [itemsPerPageManufacturers] = useState(10);

    // Pagination for Models
    const [currentPageModels, setCurrentPageModels] = useState(1);
    const [itemsPerPageModels] = useState(10);

    // Sort states for Manufacturers
    const [sortConfigManufacturers, setSortConfigManufacturers] = useState({ key: 'name', direction: 'asc' });

    // Sort states for Models
    const [sortConfigModels, setSortConfigModels] = useState({ key: 'name', direction: 'asc' });

    // Modal for Models
    const [showModelModal, setShowModelModal] = useState(false);
    const [currentModel, setCurrentModel] = useState(null);
    const [modelNameInput, setModelNameInput] = useState("");
    const [modelStatusInput, setModelStatusInput] = useState("Active");


    const API_BASE_URL = "https://localhost:7170/api"; // Replace with your actual API base URL

    // --- Fetch Data Functions ---
    const fetchManufacturers = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/CarManufacturers`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.title || 'Failed to fetch manufacturers.');
            }
            const data = await response.json();
            setManufacturers(data);
            setFilteredManufacturers(data); // Initialize filtered with all manufacturers
        } catch (err) {
            setError(err.message);
            Swal.fire('Error', err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchModels = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/CarModels`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.title || 'Failed to fetch models.');
            }
            const data = await response.json();
            setModels(data);
            setFilteredModels(data); // Initialize filtered with all models
        } catch (err) {
            setError(err.message);
            Swal.fire('Error', err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManufacturers();
        fetchModels();
    }, []);

    // --- Search and Filter Logic ---
    useEffect(() => {
        let currentFilteredManufacturers = manufacturers.filter(manufacturer =>
            manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Apply sorting for manufacturers
        if (sortConfigManufacturers.key) {
            currentFilteredManufacturers.sort((a, b) => {
                const aValue = a[sortConfigManufacturers.key].toLowerCase();
                const bValue = b[sortConfigManufacturers.key].toLowerCase();
                if (aValue < bValue) return sortConfigManufacturers.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfigManufacturers.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        setFilteredManufacturers(currentFilteredManufacturers);
        setCurrentPageManufacturers(1); // Reset pagination on filter/sort

        let currentFilteredModels = models.filter(model => {
            const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesManufacturer = selectedManufacturer ? model.manufacturerId === selectedManufacturer.manufacturerId : true;
            return matchesSearch && matchesManufacturer;
        });

        // Apply sorting for models
        if (sortConfigModels.key) {
            currentFilteredModels.sort((a, b) => {
                const aValue = a[sortConfigModels.key].toLowerCase();
                const bValue = b[sortConfigModels.key].toLowerCase();
                if (aValue < bValue) return sortConfigModels.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfigModels.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        setFilteredModels(currentFilteredModels);
        setCurrentPageModels(1); // Reset pagination on filter/sort

    }, [searchTerm, manufacturers, models, selectedManufacturer, sortConfigManufacturers, sortConfigModels]);

    // --- Manufacturer Handlers ---
    const handleAddManufacturer = () => {
        setCurrentManufacturer(null);
        setManufacturerNameInput("");
        setShowManufacturerModal(true);
    };

    const handleEditManufacturer = (manufacturer) => {
        setCurrentManufacturer(manufacturer);
        setManufacturerNameInput(manufacturer.name);
        setShowManufacturerModal(true);
    };

    const handleSaveManufacturer = async () => {
        if (!manufacturerNameInput.trim()) {
            Swal.fire('Error', 'Manufacturer name cannot be empty.', 'error');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let response;
            const manufacturerData = { name: manufacturerNameInput };

            if (currentManufacturer) {
                // Update existing manufacturer
                response = await fetch(`${API_BASE_URL}/CarManufacturers/${currentManufacturer.manufacturerId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ manufacturerId: currentManufacturer.manufacturerId, ...manufacturerData })
                });
            } else {
                // Add new manufacturer
                response = await fetch(`${API_BASE_URL}/CarManufacturers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(manufacturerData)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.title || errorData.errors?.Name?.[0] || 'Failed to save manufacturer.');
            }

            Swal.fire('Success', `Manufacturer ${currentManufacturer ? 'updated' : 'added'} successfully!`, 'success');
            setShowManufacturerModal(false);
            fetchManufacturers(); // Refresh the list
        } catch (err) {
            setError(err.message);
            Swal.fire('Error', err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // --- Model Handlers ---
    const handleAddUpdateModel = (model = null, manufacturer = null) => {
        setCurrentModel(model);
        setModelNameInput(model ? model.name : "");
        setModelStatusInput(model ? model.status : "Active");

        if (manufacturer) { // If adding model directly from a manufacturer's "View Models" button
            setSelectedManufacturer(manufacturer);
        } else if (model && model.manufacturer) { // If editing an existing model, set its manufacturer
            setSelectedManufacturer(model.manufacturer);
        } else {
            setSelectedManufacturer(null); // Clear selected if not relevant or adding new from generic add button
        }

        setShowModelModal(true);
    };


    const handleSaveModel = async () => {
        if (!modelNameInput.trim()) {
            Swal.fire('Error', 'Model name cannot be empty.', 'error');
            return;
        }
        if (!selectedManufacturer && !currentModel) { // Changed condition to check currentModel too
            Swal.fire('Error', 'Please select a manufacturer for the model.', 'error');
            return;
        }
        
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let response;
            const modelData = {
                name: modelNameInput,
                // Ensure ManufacturerId is taken from selectedManufacturer if adding, or currentModel if editing
                manufacturerId: selectedManufacturer ? selectedManufacturer.manufacturerId : (currentModel ? currentModel.manufacturerId : null),
                status: modelStatusInput
            };

            if (currentModel) {
                // Update existing model
                response = await fetch(`${API_BASE_URL}/CarModels/${currentModel.modelId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ modelId: currentModel.modelId, ...modelData })
                });
            } else {
                // Add new model
                response = await fetch(`${API_BASE_URL}/CarModels`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(modelData)
                });
            }

            if (!response.ok) {
                let errorText = 'Failed to save model.'; // Default fallback message
                try {
                    const errorData = await response.json();
                    if (typeof errorData === 'string') {
                        errorText = errorData; // Backend returned a plain string
                    } else if (errorData.message) {
                        errorText = errorData.message;
                    } else if (errorData.detail) { // Common for ProblemDetails, which BadRequest can return
                        errorText = errorData.detail;
                    } else if (errorData.errors && Object.keys(errorData.errors).length > 0) {
                        // For model validation errors, e.g., { "Name": ["The Name field is required."] }
                        const firstKey = Object.keys(errorData.errors)[0];
                        errorText = errorData.errors[firstKey][0];
                    } else if (response.statusText) { // Fallback to statusText if no other specific message found
                        errorText = response.statusText;
                    }
                } catch (parseError) {
                    // If response is not JSON, try to read as text if JSON parsing fails, then fall back to status text
                    try {
                        errorText = await response.text();
                        if (!errorText.trim()) { // If text is empty, fall back to statusText
                           errorText = response.statusText || 'An unexpected error occurred.';
                        }
                    } catch (readTextError) {
                        errorText = response.statusText || 'An unexpected error occurred.';
                    }
                }
                throw new Error(errorText); // Throw with the determined error message
            }

            Swal.fire('Success', `Model ${currentModel ? 'updated' : 'added'} successfully!`, 'success');
            setShowModelModal(false);
            fetchModels(); // Refresh the list of models
            fetchManufacturers(); // Re-fetch manufacturers to ensure counts are updated if needed
        } catch (err) {
            setError(err.message);
            Swal.fire('Error', err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleModelStatus = async (model) => {
        const newStatus = model.status === "Active" ? "Inactive" : "Active";
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/CarModels/${model.modelId}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.title || errorData.detail || 'Failed to toggle model status.');
            }

            Swal.fire('Success', `Model status changed to ${newStatus}.`, 'success');
            fetchModels(); // Refresh models
        } catch (err) {
            setError(err.message);
            Swal.fire('Error', err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSortManufacturers = (key) => {
        let direction = 'asc';
        if (sortConfigManufacturers.key === key && sortConfigManufacturers.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfigManufacturers({ key, direction });
    };

    const handleSortModels = (key) => {
        let direction = 'asc';
        if (sortConfigModels.key === key && sortConfigModels.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfigModels({ key, direction });
    };

    // --- Pagination Logic for Manufacturers ---
    const indexOfLastManufacturer = currentPageManufacturers * itemsPerPageManufacturers;
    const indexOfFirstManufacturer = indexOfLastManufacturer - itemsPerPageManufacturers;
    const currentManufacturers = filteredManufacturers.slice(indexOfFirstManufacturer, indexOfLastManufacturer);
    const totalPagesManufacturers = Math.ceil(filteredManufacturers.length / itemsPerPageManufacturers);

    // --- Pagination Logic for Models ---
    const indexOfLastModel = currentPageModels * itemsPerPageModels;
    const indexOfFirstModel = indexOfLastModel - itemsPerPageModels;
    const currentModels = filteredModels.slice(indexOfFirstModel, indexOfLastModel);
    const totalPagesModels = Math.ceil(filteredModels.length / itemsPerPageModels);

    const handleCloseManufacturerModal = () => {
        setShowManufacturerModal(false);
        setCurrentManufacturer(null);
        setManufacturerNameInput("");
    };

    const handleCloseModelModal = () => {
        setShowModelModal(false);
        setCurrentModel(null);
        setModelNameInput("");
        setModelStatusInput("Active");
        // setSelectedManufacturer(null); // Decide if you want to clear this
    };

    // --- NEW LOGIC FOR NO RESULTS MESSAGE ---
    const showOverallNoResults =
        !loading && // Only show when done loading
        !error &&   // Only show if no general error
        manufacturers.length === 0 &&
        models.length === 0;


    return (
        <div className="flex flex-col h-screen">
            <AdminTopbar />
            <div className="flex flex-1">
                <AdminSidebar />
                <div className="flex-1 p-4 md:p-8 overflow-auto bg-gray-100"> {/* Adjusted background for better aesthetics */}
                    <main className="flex-1 bg-white p-6 rounded-3xl shadow-xl"> {/* Enhanced shadow and rounded corners */}
                        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200"> {/* Added border-b */}
                            <h1 className="text-3xl font-extrabold text-gray-900">Manufacturers & Models Management</h1> {/* Stronger heading */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddManufacturer}
                                    className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white px-6 py-3 rounded-full hover:from-violet-700 hover:to-indigo-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 font-semibold text-lg" // More rounded, slightly larger text, darker gradient
                                >
                                    <FaPlus className="text-xl" /> Add Manufacturer
                                </button>
                                <button
                                    onClick={() => handleAddUpdateModel()} // Generic add model button
                                    className="bg-gradient-to-r from-purple-600 to-pink-700 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 font-semibold text-lg" // More rounded, slightly larger text, darker gradient
                                >
                                    <FaPlus className="text-xl" /> Add Model
                                </button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6 bg-gray-50 p-4 rounded-xl shadow-inner flex items-center gap-4 border border-gray-200"> {/* Softer background, inner shadow, border */}
                            <FaSearch className="text-gray-500 text-xl" /> {/* Darker icon color */}
                            <input
                                type="text"
                                placeholder="Search manufacturers or models..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 outline-none text-gray-800" // Added outline-none, darker text
                            />
                        </div>

                        {loading && (
                            <div className="text-center py-12 bg-blue-50 rounded-lg shadow-sm"> {/* Styling for loading message */}
                                <FaSpinner className="animate-spin text-5xl text-blue-600 mx-auto" />
                                <p className="mt-4 text-blue-700 text-lg font-medium">Loading data, please wait...</p>
                            </div>
                        )}

                        {error && !loading && (
                            <div className="text-center py-12 bg-red-50 rounded-lg shadow-sm"> {/* Styling for error message */}
                                <p className="text-xl font-bold text-red-700">Error fetching data:</p>
                                <p className="mt-2 text-red-600 text-lg">{error}</p>
                                <p className="mt-4 text-red-500">Please try again later or contact support.</p>
                            </div>
                        )}

                        {/* --- Overall No Results Message --- */}
                        {showOverallNoResults && (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl shadow-inner border border-dashed border-gray-300"> {/* Distinct styling for no results */}
                                <p className="text-3xl font-extrabold text-gray-600 mb-4">No Data Found!</p>
                                <p className="mt-4 text-lg text-gray-500">
                                    It looks like there are no car manufacturers or models in the system yet.
                                </p>
                                <p className="mt-2 text-lg text-gray-500">
                                    Click "Add Manufacturer" or "Add Model" to get started.
                                </p>
                                <div className="flex justify-center gap-8 mt-8">
                                    <FaBuilding className="text-8xl text-gray-400" />
                                    <FaCarAlt className="text-8xl text-gray-400" />
                                </div>
                            </div>
                        )}

                        {/* --- Render sections if not overall no results and not loading/error --- */}
                        {!loading && !error && !showOverallNoResults && (
                            <>
                                {/* Car Manufacturers Section */}
                                <section className="mb-10 bg-white p-6 rounded-2xl shadow-md border border-gray-200"> {/* Added border */}
                                    <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
                                        <FaBuilding className="text-violet-600" /> Car Manufacturers
                                    </h2>
                                    {filteredManufacturers.length > 0 ? (
                                        <>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full leading-normal bg-white rounded-lg overflow-hidden"> {/* Added rounded corners to table */}
                                                    <thead>
                                                        <tr className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300 text-gray-700 uppercase text-sm font-semibold"> {/* Gradient header */}
                                                            <th className="px-5 py-3 text-left">
                                                                <button onClick={() => handleSortManufacturers('name')} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                                                                    Name
                                                                    {sortConfigManufacturers.key === 'name' && (
                                                                        sortConfigManufacturers.direction === 'asc' ? <FaSortAlphaDown className="ml-1" /> : <FaSortAlphaUp className="ml-1" />
                                                                    )}
                                                                </button>
                                                            </th>
                                                            <th className="px-5 py-3 text-left">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentManufacturers.map((manufacturer) => (
                                                            <tr key={manufacturer.manufacturerId} className="border-b border-gray-100 hover:bg-gray-50 text-gray-800 transition-colors duration-150"> {/* Softer border, subtle hover */}
                                                                <td className="px-5 py-4 text-sm">{manufacturer.name}</td> {/* Increased padding */}
                                                                <td className="px-5 py-4 text-sm">
                                                                    <div className="flex items-center gap-3">
                                                                        <button
                                                                            onClick={() => handleEditManufacturer(manufacturer)}
                                                                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1 rounded hover:bg-blue-50" // Added padding, rounded, hover background
                                                                            title="Edit Manufacturer"
                                                                        >
                                                                            <FaEdit className="text-lg" />
                                                                        </button>
                                                                        {/* Removed Delete Button for Manufacturer */}
                                                                        {/* <button
                                                                            onClick={() => handleDeleteManufacturer(manufacturer.manufacturerId)}
                                                                            className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                                                                            title="Delete Manufacturer"
                                                                        >
                                                                            <FaTimes className="text-lg" />
                                                                        </button> */}
                                                                        <button
                                                                            onClick={() => setSelectedManufacturer(manufacturer)}
                                                                            className={`text-violet-600 hover:text-violet-800 transition-colors duration-200 flex items-center gap-1 p-1 rounded hover:bg-violet-50 ${selectedManufacturer?.manufacturerId === manufacturer.manufacturerId ? 'font-bold bg-violet-100' : ''}`} // Added padding, rounded, hover background, active state styling
                                                                            title="View Models"
                                                                        >
                                                                            <FaListAlt className="text-lg" /> Models
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleAddUpdateModel(null, manufacturer)} // Add model directly for this manufacturer
                                                                            className="text-green-600 hover:text-green-800 transition-colors duration-200 p-1 rounded hover:bg-green-50" // Added padding, rounded, hover background
                                                                            title="Add Model for this Manufacturer"
                                                                        >
                                                                            <FaPlus className="text-lg" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/* Pagination for Manufacturers */}
                                            {filteredManufacturers.length > itemsPerPageManufacturers && (
                                                <div className="flex justify-center items-center mt-6 gap-4"> {/* Centered pagination */}
                                                    <button
                                                        onClick={() => setCurrentPageManufacturers(1)}
                                                        disabled={currentPageManufacturers === 1}
                                                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors flex items-center gap-1"
                                                    >
                                                        <FaAngleDoubleLeft />
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentPageManufacturers(prev => Math.max(prev - 1, 1))}
                                                        disabled={currentPageManufacturers === 1}
                                                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors flex items-center gap-1"
                                                    >
                                                        <FaChevronLeft /> Prev
                                                    </button>
                                                    <span className="text-gray-700 text-md font-medium">Page {currentPageManufacturers} of {totalPagesManufacturers}</span>
                                                    <button
                                                        onClick={() => setCurrentPageManufacturers(prev => Math.min(prev + 1, totalPagesManufacturers))}
                                                        disabled={currentPageManufacturers === totalPagesManufacturers}
                                                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors flex items-center gap-1"
                                                    >
                                                        Next <FaChevronRight />
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentPageManufacturers(totalPagesManufacturers)}
                                                        disabled={currentPageManufacturers === totalPagesManufacturers}
                                                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors flex items-center gap-1"
                                                    >
                                                        <FaAngleDoubleRight />
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-600">
                                            <FaBuilding className="mx-auto text-5xl mb-3 text-gray-400" />
                                            <p className="text-lg font-medium">No manufacturers found matching your search.</p>
                                            <p className="text-sm mt-1">Try a different search term or add a new manufacturer.</p>
                                        </div>
                                    )}
                                </section>

                                {/* Car Models Section */}
                                <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200"> {/* Added border */}
                                    <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
                                        <FaCarAlt className="text-blue-600" /> Car Models
                                        {selectedManufacturer && (
                                            <span className="text-xl text-gray-600 ml-2">
                                                (for <span className="font-semibold text-blue-700">{selectedManufacturer.name}</span>)
                                                <button onClick={() => setSelectedManufacturer(null)} className="ml-3 text-red-500 hover:text-red-700 text-base p-1 rounded hover:bg-red-50 transition-colors duration-200" title="Clear Manufacturer Filter">
                                                    <FaTimes className="inline-block mr-1" /> Clear Filter
                                                </button>
                                            </span>
                                        )}
                                    </h2>

                                    {filteredModels.length > 0 ? (
                                        <>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full leading-normal bg-white rounded-lg overflow-hidden"> {/* Added rounded corners to table */}
                                                    <thead>
                                                        <tr className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300 text-gray-700 uppercase text-sm font-semibold"> {/* Gradient header */}
                                                            <th className="px-5 py-3 text-left">
                                                                <button onClick={() => handleSortModels('name')} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                                                                    Model Name
                                                                    {sortConfigModels.key === 'name' && (
                                                                        sortConfigModels.direction === 'asc' ? <FaSortAlphaDown className="ml-1" /> : <FaSortAlphaUp className="ml-1" />
                                                                    )}
                                                                </button>
                                                            </th>
                                                            <th className="px-5 py-3 text-left">
                                                                <button onClick={() => handleSortModels('manufacturer.name')} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                                                                    Manufacturer
                                                                    {sortConfigModels.key === 'manufacturer.name' && (
                                                                        sortConfigModels.direction === 'asc' ? <FaSortAlphaDown className="ml-1" /> : <FaSortAlphaUp className="ml-1" />
                                                                    )}
                                                                </button>
                                                            </th>
                                                            <th className="px-5 py-3 text-left">
                                                                <button onClick={() => handleSortModels('status')} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                                                                    Status
                                                                    {sortConfigModels.key === 'status' && (
                                                                        sortConfigModels.direction === 'asc' ? <FaSortAlphaDown className="ml-1" /> : <FaSortAlphaUp className="ml-1" />
                                                                    )}
                                                                </button>
                                                            </th>
                                                            <th className="px-5 py-3 text-left">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentModels.map((model) => (
                                                            <tr key={model.modelId} className="border-b border-gray-100 hover:bg-gray-50 text-gray-800 transition-colors duration-150"> {/* Softer border, subtle hover */}
                                                                <td className="px-5 py-4 text-sm">{model.name}</td>
                                                                <td className="px-5 py-4 text-sm">{model.manufacturer?.name || 'N/A'}</td>
                                                                <td className="px-5 py-4 text-sm">
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${model.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                        {model.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-5 py-4 text-sm">
                                                                    <div className="flex items-center gap-3">
                                                                        <button
                                                                            onClick={() => handleAddUpdateModel(model)}
                                                                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1 rounded hover:bg-blue-50"
                                                                            title="Edit Model"
                                                                        >
                                                                            <FaEdit className="text-lg" />
                                                                        </button>
                                                                        {/* Removed Delete Button for Model */}
                                                                        {/* <button
                                                                            onClick={() => handleDeleteModel(model.modelId)}
                                                                            className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                                                                            title="Delete Model"
                                                                        >
                                                                            <FaTimes className="text-lg" />
                                                                        </button> */}
                                                                        <button
                                                                            onClick={() => handleToggleModelStatus(model)}
                                                                            className={`transition-colors duration-200 p-1 rounded ${model.status === 'Active' ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-50' : 'text-green-600 hover:text-green-800 hover:bg-green-50'}`}
                                                                            title={model.status === 'Active' ? 'Deactivate Model' : 'Activate Model'}
                                                                        >
                                                                            {model.status === 'Active' ? <FaToggleOff className="text-lg" /> : <FaToggleOn className="text-lg" />}
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/* Pagination for Models */}
                                            {filteredModels.length > itemsPerPageModels && (
                                                <div className="flex justify-center items-center mt-6 gap-4"> {/* Centered pagination */}
                                                    <button
                                                        onClick={() => setCurrentPageModels(1)}
                                                        disabled={currentPageModels === 1}
                                                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors flex items-center gap-1"
                                                    >
                                                        <FaAngleDoubleLeft />
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentPageModels(prev => Math.max(prev - 1, 1))}
                                                        disabled={currentPageModels === 1}
                                                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors flex items-center gap-1"
                                                    >
                                                        <FaChevronLeft /> Prev
                                                    </button>
                                                    <span className="text-gray-700 text-md font-medium">Page {currentPageModels} of {totalPagesModels}</span>
                                                    <button
                                                        onClick={() => setCurrentPageModels(prev => Math.min(prev + 1, totalPagesModels))}
                                                        disabled={currentPageModels === totalPagesModels}
                                                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors flex items-center gap-1"
                                                    >
                                                        Next <FaChevronRight />
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentPageModels(totalPagesModels)}
                                                        disabled={currentPageModels === totalPagesModels}
                                                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors flex items-center gap-1"
                                                    >
                                                        <FaAngleDoubleRight />
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-600">
                                            <FaCarAlt className="mx-auto text-5xl mb-3 text-gray-400" />
                                            <p className="text-lg font-medium">No car models found matching your search or selected manufacturer.</p>
                                            <p className="text-sm mt-1">Try a different search term, clear the manufacturer filter, or add a new model.</p>
                                        </div>
                                    )}
                                </section>
                            </>
                        )}


                        {/* Manufacturer Modal */}
                        {showManufacturerModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in"> {/* Darker overlay, fade-in animation */}
                                <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100 animate-slide-up"> {/* Scale and slide-up animation */}
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center border-b pb-3"> {/* Stronger heading, border */}
                                        {currentManufacturer ? "Edit Manufacturer" : "Add New Manufacturer"}
                                    </h2>
                                    <div className="mb-6">
                                        <label htmlFor="manufacturerName" className="block text-gray-700 text-base font-semibold mb-2"> {/* Larger text, bolder */}
                                            Manufacturer Name:
                                        </label>
                                        <input
                                            type="text"
                                            id="manufacturerName"
                                            value={manufacturerNameInput}
                                            onChange={(e) => setManufacturerNameInput(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 text-gray-800 text-lg" // Larger text, more focus ring
                                            placeholder="e.g., Toyota, Honda"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleCloseManufacturerModal}
                                            className="flex-1 px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full transition-all duration-300 font-semibold text-lg shadow-md" // Rounded, text-lg, shadow
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveManufacturer}
                                            disabled={loading || !manufacturerNameInput.trim()}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold text-lg" // Rounded, text-lg, stronger hover
                                        >
                                            {loading ? (
                                                <>
                                                    <FaSpinner className="animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                currentManufacturer ? "Update Manufacturer" : "Add Manufacturer"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Model Modal */}
                        {showModelModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in"> {/* Darker overlay, fade-in animation */}
                                <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100 animate-slide-up"> {/* Scale and slide-up animation */}
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center border-b pb-3"> {/* Stronger heading, border */}
                                        {currentModel ? "Edit Car Model" : `Add New Car Model for ${selectedManufacturer?.name || ''}`}
                                    </h2>
                                    <div className="mb-4">
                                        <label htmlFor="modelName" className="block text-gray-700 text-base font-semibold mb-2">
                                            Model Name:
                                        </label>
                                        <input
                                            type="text"
                                            id="modelName"
                                            value={modelNameInput}
                                            onChange={(e) => setModelNameInput(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 text-gray-800 text-lg"
                                            placeholder="e.g., Camry, Civic"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="manufacturerSelect" className="block text-gray-700 text-base font-semibold mb-2">
                                            Manufacturer:
                                        </label>
                                        <select
                                            id="manufacturerSelect"
                                            value={selectedManufacturer ? selectedManufacturer.manufacturerId : ""}
                                            onChange={(e) => setSelectedManufacturer(manufacturers.find(m => m.manufacturerId === parseInt(e.target.value)))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 text-gray-800 bg-white text-lg"
                                            disabled={!!currentModel} // Disable if editing existing model to prevent changing manufacturer
                                        >
                                            <option value="">Select a Manufacturer</option>
                                            {manufacturers.map((m) => (
                                                <option key={m.manufacturerId} value={m.manufacturerId}>
                                                    {m.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-6">
                                        <label htmlFor="modelStatus" className="block text-gray-700 text-base font-semibold mb-2">
                                            Status:
                                        </label>
                                        <select
                                            id="modelStatus"
                                            value={modelStatusInput}
                                            onChange={(e) => setModelStatusInput(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 text-gray-800 bg-white text-lg"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleCloseModelModal}
                                            className="flex-1 px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full transition-all duration-300 font-semibold text-lg shadow-md"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveModel}
                                            disabled={loading || !modelNameInput.trim()}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold text-lg"
                                        >
                                            {loading ? (<><FaSpinner className="animate-spin" />Saving...</>) : (currentModel ? "Update Model" : "Add Model")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}