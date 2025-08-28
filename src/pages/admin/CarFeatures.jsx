import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import {
    FaPlus,
    FaEdit,
    FaToggleOn,
    FaToggleOff,
    FaTimes,
    FaSearch,
    FaSpinner,
    FaCar,
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
    FaAngleDoubleRight
} from "react-icons/fa";
import { getApiBaseUrl } from "../../../util/apiconfig";

export default function CarFeaturesManagementPage() {
    const [features, setFeatures] = useState([]);
    const [filteredFeatures, setFilteredFeatures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(null);
    const [featureNameInput, setFeatureNameInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const API_BASE = getApiBaseUrl();
    // Filter states
    const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [paginatedFeatures, setPaginatedFeatures] = useState([]);

    // --- Fetch Features ---
    const fetchFeatures = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE}/api/features`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch features.");
            }
            const data = await response.json();
            setFeatures(data);
            setFilteredFeatures(data);
        } catch (err) {
            console.error("Error fetching features:", err);
            setError(err.message);
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: err.message || "Unable to load features. Please check your backend API.",
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-lg'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatures();
    }, []);

    // --- Search, Filter and Sort ---
    useEffect(() => {
        let filtered = features.filter(feature => {
            const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" ||
                (statusFilter === "active" && feature.status) ||
                (statusFilter === "inactive" && !feature.status);

            return matchesSearch && matchesStatus;
        });

        // Sort features
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'name') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredFeatures(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [features, searchTerm, statusFilter, sortConfig]);

    // --- Pagination ---
    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setPaginatedFeatures(filteredFeatures.slice(startIndex, endIndex));
    }, [filteredFeatures, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredFeatures.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredFeatures.length);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index && totalPages > 1);
    };

    // --- Sort Handler ---
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // --- Modal Handlers ---
    const handleAddClick = () => {
        setCurrentFeature(null);
        setFeatureNameInput("");
        setShowModal(true);
    };

    const handleEditClick = (feature) => {
        setCurrentFeature(feature);
        setFeatureNameInput(feature.name);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentFeature(null);
        setFeatureNameInput("");
    };

    // --- CRUD Operations ---
    const handleSaveFeature = async () => {
        if (!featureNameInput.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Warning!",
                text: "Feature name cannot be empty.",
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-lg'
                }
            });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            let apiEndpoint = `${API_BASE}/api/features`;
            let httpMethod = "POST";
            let successMessage = "Feature added successfully!";
            let errorMessage = "Failed to add feature.";

            let bodyData = { Name: featureNameInput };

            if (currentFeature) {
                httpMethod = "PUT";
                apiEndpoint = `${API_BASE}/api/features/${currentFeature.featureId}`;
                bodyData = {
                    featureId: currentFeature.featureId,
                    Name: featureNameInput
                };
                successMessage = "Feature updated successfully!";
                errorMessage = "Failed to update feature.";
            }

            const response = await fetch(apiEndpoint, {
                method: httpMethod,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorMessage);
            }

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: successMessage,
                timer: 2000,
                showConfirmButton: false,
                customClass: {
                    popup: 'rounded-2xl'
                }
            });

            handleCloseModal();
            fetchFeatures();
        } catch (err) {
            console.error("Error saving feature:", err);
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: err.message || "An error occurred while saving the feature.",
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'rounded-lg'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (featureId, currentStatus, featureName) => {
        const newStatus = !currentStatus;
        const actionText = newStatus ? "activate" : "deactivate";
        const statusText = newStatus ? "Active" : "Inactive";

        Swal.fire({
            title: "Are you sure?",
            text: `You are about to ${actionText} "${featureName}". This will change its status to ${statusText}.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: newStatus ? "#10b981" : "#f59e0b",
            cancelButtonColor: "#6b7280",
            confirmButtonText: `Yes, ${actionText}!`,
            cancelButtonText: "Cancel",
            reverseButtons: true,
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-lg',
                cancelButton: 'rounded-lg'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const token = localStorage.getItem("token");
                    const response = await fetch(`${API_BASE}/api/features/${featureId}/toggle-status`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: newStatus }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Failed to update feature status.");
                    }

                    Swal.fire({
                        icon: "success",
                        title: "Status Updated!",
                        text: `Feature "${featureName}" has been ${newStatus ? "activated" : "deactivated"} successfully.`,
                        timer: 2000,
                        showConfirmButton: false,
                        customClass: {
                            popup: 'rounded-2xl'
                        }
                    });
                    fetchFeatures();
                } catch (err) {
                    console.error("Error updating feature status:", err);
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: err.message || "An error occurred while updating the feature status.",
                        customClass: {
                            popup: 'rounded-2xl',
                            confirmButton: 'rounded-lg'
                        }
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setSortConfig({ key: 'name', direction: 'asc' });
        setCurrentPage(1);
    };

    // Get filter count
    const activeFiltersCount = [
        searchTerm,
        statusFilter !== "all"
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="flex">
                <AdminSidebar />
                <div className="flex-1 flex flex-col">
                    <AdminTopbar />
                    <main className="flex-1 p-4 lg:p-8">
                        <div className="max-w-7xl mx-auto space-y-6">
                            {/* Header Section */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg">
                                            <FaCar className="text-white text-2xl" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                                Car Features Management
                                            </h1>
                                            <p className="text-gray-600 text-sm lg:text-base mt-1">
                                                Manage and organize car features and specifications
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAddClick}
                                        disabled={loading}
                                        className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] font-semibold"
                                    >
                                        <FaPlus className="text-sm" />
                                        Add New Feature
                                    </button>
                                </div>
                            </div>

                            {/* Search and Filter Section */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Search Bar */}
                                    <div className="flex-1 relative">
                                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search features..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                        />
                                    </div>

                                    {/* Filter Dropdown
                                    <div className="relative">
                                        <button
                                        
                                            // onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                            onClick={() => {
                                                console.log("Main Filter button clicked. Toggling dropdown. Current state:", showFilterDropdown);
                                                setShowFilterDropdown(!showFilterDropdown);
                                              }}
                                            className="flex items-center gap-3 px-6 py-3 bg-white/50 hover:bg-white/80 border-2 border-gray-200 rounded-2xl transition-all duration-300 backdrop-blur-sm min-w-[140px] justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FaFilter className="text-gray-500" />
                                                <span className="font-medium text-gray-700">Filter</span>
                                                {activeFiltersCount > 0 && (
                                                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                                                        {activeFiltersCount}
                                                    </span>
                                                )}
                                            </div>
                                            {showFilterDropdown ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                                        </button>

                                        {showFilterDropdown && (
                                            <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 min-w-[250px] z-50">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status Filter</label>
                                                        <div className="space-y-2">
                                                            {[
                                                                { value: "all", label: "All Status", icon: FaFilter },
                                                                { value: "active", label: "Active Only", icon: FaCheck },
                                                                { value: "inactive", label: "Inactive Only", icon: FaBan }
                                                            ].map((option) => (
                                                                <button
                                                                    key={option.value}
                                                                    onClick={() => {
                                                                        setStatusFilter(option.value);
                                                                        setShowFilterDropdown(false); // <--- ADD THIS LINE
                                                                    }}
                                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${statusFilter === option.value
                                                                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                                                                            : 'hover:bg-gray-100 text-gray-700 border-2 border-transparent'
                                                                        }`}
                                                                >
                                                                    <option.icon className="text-sm" />
                                                                    <span className="font-medium">{option.label}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Items per page</label>
                                                        <select
                                                            value={itemsPerPage}
                                                            onChange={(e) => {
                                                                setItemsPerPage(Number(e.target.value));
                                                                setCurrentPage(1);
                                                                setShowFilterDropdown(false); // <--- ADD THIS LINE
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                        >
                                                            <option value={5}>5 per page</option>
                                                            <option value={6}>6 per page</option>
                                                            <option value={10}>10 per page</option>
                                                            <option value={15}>15 per page</option>
                                                            <option value={20}>20 per page</option>
                                                        </select>
                                                    </div>

                                                    <div className="pt-3 border-t border-gray-200">
                                                        <button
                                                            onClick={clearFilters}
                                                            className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                                                        >
                                                            Clear All Filters
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div> */}
                                </div>

                                {/* Stats */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex flex-wrap gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                                            <span className="text-gray-600">Total: <span className="font-bold text-gray-800">{features.length}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                                            <span className="text-gray-600">Active: <span className="font-bold text-green-600">{features.filter(f => f.status).length}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-full"></div>
                                            <span className="text-gray-600">Inactive: <span className="font-bold text-red-600">{features.filter(f => !f.status).length}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"></div>
                                            <span className="text-gray-600">Filtered: <span className="font-bold text-purple-600">{filteredFeatures.length}</span></span>
                                        </div>
                                        {totalPages > 1 && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                                                <span className="text-gray-600">Showing: <span className="font-bold text-orange-600">{startIndex + 1}-{endIndex} of {filteredFeatures.length}</span></span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                                            <FaSpinner className="absolute inset-0 m-auto animate-spin text-white text-2xl" />
                                        </div>
                                        <p className="text-gray-600 mt-4 font-medium">Loading features...</p>
                                    </div>
                                ) : error ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <div className="bg-gradient-to-br from-red-100 to-rose-100 p-6 rounded-3xl mb-4">
                                            <FaTimes className="text-red-600 text-3xl" />
                                        </div>
                                        <p className="text-red-600 text-center font-medium">{error}</p>
                                        <button
                                            onClick={fetchFeatures}
                                            className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                ) : filteredFeatures.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <div className="bg-gradient-to-br from-gray-100 to-slate-100 p-6 rounded-3xl mb-4">
                                            <FaCar className="text-gray-400 text-4xl" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-700 mb-2">
                                            {searchTerm || statusFilter !== "all" ? "No matching features found" : "No features found"}
                                        </h3>
                                        <p className="text-gray-500 mb-8 text-center max-w-md leading-relaxed">
                                            {searchTerm || statusFilter !== "all"
                                                ? `No features match your current filters. Try adjusting your search terms or filters.`
                                                : "Get started by adding your first car feature to begin managing your inventory."
                                            }
                                        </p>
                                        {!searchTerm && statusFilter === "all" ? (
                                            <button
                                                onClick={handleAddClick}
                                                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold"
                                            >
                                                <FaPlus />
                                                Add First Feature
                                            </button>
                                        ) : (
                                            <button
                                                onClick={clearFilters}
                                                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-600 to-slate-600 text-white rounded-2xl hover:from-gray-700 hover:to-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold"
                                            >
                                                <FaTimes />
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gradient-to-r from-slate-50 to-gray-50 border-b-2 border-gray-200">
                                                <tr>
                                                    <th className="text-left py-6 px-8 font-bold text-gray-700 text-sm uppercase tracking-wider">
                                                        No.
                                                    </th>
                                                    <th
                                                        className="text-left py-6 px-8 font-bold text-gray-700 text-sm uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                                        onClick={() => handleSort('name')}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            Feature Name
                                                            <div className="flex flex-col">
                                                                {sortConfig.key === 'name' && sortConfig.direction === 'asc' ? (
                                                                    <FaSortAlphaDown className="text-blue-500" />
                                                                ) : sortConfig.key === 'name' && sortConfig.direction === 'desc' ? (
                                                                    <FaSortAlphaUp className="text-blue-500" />
                                                                ) : (
                                                                    <FaSortAlphaDown className="text-gray-300" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th
                                                        className="text-center py-6 px-8 font-bold text-gray-700 text-sm uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                                        onClick={() => handleSort('status')}
                                                    >
                                                        <div className="flex items-center justify-center gap-2">
                                                            Status
                                                            <div className="flex flex-col">
                                                                {sortConfig.key === 'status' && sortConfig.direction === 'asc' ? (
                                                                    <FaChevronUp className="text-blue-500 text-xs" />
                                                                ) : sortConfig.key === 'status' && sortConfig.direction === 'desc' ? (
                                                                    <FaChevronDown className="text-blue-500 text-xs" />
                                                                ) : (
                                                                    <FaChevronDown className="text-gray-300 text-xs" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th className="text-center py-6 px-8 font-bold text-gray-700 text-sm uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {paginatedFeatures.map((feature, index) => (
                                                    <tr
                                                        key={feature.featureId}
                                                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
                                                    >
                                                        <td className="py-6 px-8 text-sm text-gray-900 font-mono font-semibold">
                                                            <span className="bg-gray-100 px-3 py-1 rounded-full">
                                                                {startIndex + index + 1}
                                                            </span>
                                                        </td>
                                                        <td className="py-6 px-8 text-sm text-gray-900 font-semibold">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                                                                {feature.name}
                                                            </div>
                                                        </td>
                                                        <td className="py-6 px-8 text-center">
                                                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${feature.status
                                                                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-200'
                                                                    : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-200'
                                                                }`}>
                                                                {feature.status ? (
                                                                    <><FaCheck className="mr-1" /> Active</>
                                                                ) : (
                                                                    <><FaBan className="mr-1" /> Inactive</>
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="py-6 px-8 text-center">
                                                            <div className="flex items-center justify-center gap-3">
                                                                <button
                                                                    onClick={() => handleEditClick(feature)}
                                                                    className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:scale-110 group-hover:scale-105"
                                                                    title="Edit Feature"
                                                                >
                                                                    <FaEdit className="text-lg" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleToggleStatus(feature.featureId, feature.status, feature.name)}
                                                                    className={`p-3 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:scale-110 group-hover:scale-105 ${feature.status
                                                                            ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-100'
                                                                            : 'text-green-600 hover:text-green-800 hover:bg-green-100'
                                                                        }`}
                                                                    title={feature.status ? "Deactivate Feature" : "Activate Feature"}
                                                                >
                                                                    {feature.status ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && !loading && filteredFeatures.length > 0 && (
                                    <div className="border-t border-gray-200 px-6 py-6 bg-gradient-to-r from-gray-50 to-slate-50">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            {/* Page Info */}
                                            <div className="text-sm text-gray-600">
                                                Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{' '}
                                                <span className="font-semibold text-gray-900">{endIndex}</span> of{' '}
                                                <span className="font-semibold text-gray-900">{filteredFeatures.length}</span> results
                                            </div>

                                            {/* Pagination Controls */}
                                            <div className="flex items-center gap-2">
                                                {/* First Page */}
                                                <button
                                                    onClick={() => handlePageChange(1)}
                                                    disabled={currentPage === 1}
                                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                                    title="First page"
                                                >
                                                    <FaAngleDoubleLeft />
                                                </button>

                                                {/* Previous Page */}
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                                    title="Previous page"
                                                >
                                                    <FaChevronLeft />
                                                </button>

                                                {/* Page Numbers */}
                                                <div className="flex items-center gap-1 mx-2">
                                                    {getVisiblePages().map((page, index) => (
                                                        <React.Fragment key={index}>
                                                            {page === '...' ? (
                                                                <span className="px-3 py-2 text-gray-500">...</span>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handlePageChange(page)}
                                                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${currentPage === page
                                                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                                                                            : 'text-gray-700 hover:text-blue-600 hover:bg-white'
                                                                        }`}
                                                                >
                                                                    {page}
                                                                </button>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </div>

                                                {/* Next Page */}
                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                                    title="Next page"
                                                >
                                                    <FaChevronRight />
                                                </button>

                                                {/* Last Page */}
                                                <button
                                                    onClick={() => handlePageChange(totalPages)}
                                                    disabled={currentPage === totalPages}
                                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                                    title="Last page"
                                                >
                                                    <FaAngleDoubleRight />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal */}
                        {showModal && (
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all animate-in fade-in duration-300">
                                    <div className="p-8 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                                {currentFeature ? "Edit Feature" : "Add New Feature"}
                                            </h2>
                                            <button
                                                onClick={handleCloseModal}
                                                className="p-2 text-gray-400 hover:text-gray-600 rounded-2xl hover:bg-gray-100 transition-all duration-200"
                                            >
                                                <FaTimes size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <div className="mb-8">
                                            <label htmlFor="featureName" className="block text-sm font-bold text-gray-700 mb-3">
                                                Feature Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="featureName"
                                                value={featureNameInput}
                                                onChange={(e) => setFeatureNameInput(e.target.value)}
                                                className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 font-medium"
                                                placeholder="e.g., GPS Navigation, Sunroof, Leather Seats"
                                                autoFocus
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={handleCloseModal}
                                                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-300 font-semibold"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveFeature}
                                                disabled={loading || !featureNameInput.trim()}
                                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold"
                                            >
                                                {loading ? (
                                                    <>
                                                        <FaSpinner className="animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    currentFeature ? "Update Feature" : "Add Feature"
                                                )}
                                            </button>
                                        </div>
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