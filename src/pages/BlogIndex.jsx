import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineTag, HiOutlineCalendar } from 'react-icons/hi';
import { getApiBaseUrl } from "../../util/apiconfig";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// A more modern, dark-themed blog index component.
const BlogIndex = () => {
    const API_BASE = getApiBaseUrl();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    const searchTimeout = useRef(null);

    // Function to fetch blog posts from the API with filters and pagination
    const fetchPosts = async () => {
        try {
            setLoading(true);
            let url = `${API_BASE}/api/user/posts?page=${currentPage}&pageSize=${pageSize}&isPublished=true`;

            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }
            if (selectedCategory) {
                url += `&categoryId=${selectedCategory}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            setPosts(data.items || []);
            setTotalItems(data.totalCount || 0);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Failed to load blog posts.');
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch blog categories
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/user/posts/categories`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories.');
        }
    };

    // Fetch categories on initial component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch posts whenever search terms, category, or page changes
    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        searchTimeout.current = setTimeout(() => {
            fetchPosts();
        }, 500); // Debounce search to prevent excessive API calls
        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [searchTerm, selectedCategory, currentPage]);

    // Format date string for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Handle search input change
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Handle category dropdown change
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    };

    // Render pagination controls
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        return (
            <div className="flex justify-center mt-12">
                <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 rounded-l-lg border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium transition-colors ${
                                currentPage === page ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-4 py-2 rounded-r-lg border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </nav>
            </div>
        );
    };

    // Display a loading spinner while data is being fetched
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Main component render
    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-900 min-h-screen font-sans text-white">
            <header className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">Blog Posts & Insights</h1>
                <p className="text-xl text-gray-400">Useful stories, knowledge, and experiences.</p>
            </header>

            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                <div className="relative w-full md:w-1/2">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        className="pl-12 pr-4 py-3 w-full border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className="relative w-full md:w-1/4">
                    <select
                        className="block appearance-none w-full bg-gray-800 border border-gray-700 text-white py-3 px-4 pr-10 rounded-lg leading-tight focus:outline-none focus:bg-gray-700 focus:border-blue-500 transition-all duration-300"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="">All categories</option>
                        {categories.map(category => (
                            <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post.postId} className="bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
                            <Link to={`/blog/${post.slug}`} className="block p-8">
                                <h2 className="text-2xl font-bold text-blue-400 mb-4 hover:text-blue-300 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-base text-gray-400 mb-6 line-clamp-3">
                                    {post.excerpt || post.content.substring(0, 150) + '...'}
                                </p>
                                <div className="flex items-center text-sm text-gray-500 space-x-6">
                                    <div className="flex items-center">
                                        <HiOutlineCalendar className="mr-2 h-5 w-5 text-gray-500" />
                                        <span>{formatDate(post.publishedDate)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <HiOutlineTag className="mr-2 h-5 w-5 text-gray-500" />
                                        <span>{post.category?.name || 'Uncategorized'}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-16 text-gray-500 text-xl">
                        No posts found.
                    </div>
                )}
            </div>

            {renderPagination()}
        </div>
    );
};

export default BlogIndex;
