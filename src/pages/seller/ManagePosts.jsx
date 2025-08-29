import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePlus,
  HiOutlineX
} from 'react-icons/hi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApiBaseUrl } from "../../../util/apiconfig";

import SellerSidebar from "../../components/seller/SellerSidebar";
import SellerTopbar from "../../components/seller/SellerTopbar";

const ManagePosts = () => {
  const API_BASE = getApiBaseUrl();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingPost, setViewingPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const searchTimeout = useRef(null);
  const navigate = useNavigate();

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      let url = `${API_BASE}/api/seller/posts?page=${currentPage}&pageSize=${pageSize}`;

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      if (selectedCategory) {
        url += `&categoryId=${selectedCategory}`;
      }

      if (selectedStatus !== '') {
        url += `&isPublished=${selectedStatus === 'Published'}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data.items || []);
      setTotalItems(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts. Please try again.');
      setLoading(false);
    }
  };

  // Fetch categories and tags
  const fetchCategoriesAndTags = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const [categoriesRes, tagsRes] = await Promise.all([
        fetch(`${API_BASE}/api/seller/posts/categories`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE}/api/seller/posts/tags`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!categoriesRes.ok || !tagsRes.ok) {
        const errorData = await categoriesRes.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch categories or tags');
      }

      const categoriesData = await categoriesRes.json();
      const tagsData = await tagsRes.json();

      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error fetching categories/tags:', error);
      toast.error('Failed to load categories/tags');
    }
  };

  useEffect(() => {
    fetchCategoriesAndTags();
  }, []);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      fetchPosts();
    }, 500);
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm, selectedCategory, selectedStatus, currentPage, pageSize]);

  // Handle post actions
  const handleEdit = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/seller/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch post details for editing');
      }
      const postData = await response.json();
      
      // Map TagIds to tag names for the modal's state
      const selectedTagNames = (postData.tags || []).map(tag => tag.name);


      setEditingPost({
        ...postData,
        categoryId: postData.categoryId,
        selectedTagNames: selectedTagNames,
      });

      setShowCreateModal(true);
    } catch (error) {
      console.error('Error fetching post for edit:', error);
      toast.error('Failed to load post for editing. Please try again.');
    }
  };

  const handleView = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/seller/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch post details');
      }
      const postData = await response.json();
      setViewingPost(postData);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching post for view:', error);
      toast.error('Failed to load post details. Please try again.');
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_BASE}/api/seller/posts/${postId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to delete post');
        }

        toast.success('Post deleted successfully');
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error(error.message || 'Failed to delete post');
      }
    }
  };

  const handlePublishToggle = async (postId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/seller/posts/${postId}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(!currentStatus)
      });

      if (!response.ok) {
        throw new Error('Failed to update post status');
      }

      toast.success(`Post ${!currentStatus ? 'published' : 'unpublished'} successfully`);
      fetchPosts();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Failed to update post status');
    }
  };

  const handleSavePost = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const isEdit = !!editingPost;
      const url = isEdit
        ? `${API_BASE}/api/seller/posts/${editingPost.postId}`
        : `${API_BASE}/api/seller/posts`;

      const method = isEdit ? 'PUT' : 'POST';

      // Prepare the request body
      const requestBody = {
        ...formData,
        // Ensure we're only sending the necessary fields
        title: formData.title,
        content: formData.content,
        categoryId: formData.categoryId,
        isPublished: formData.isPublished || false,
        slug: formData.slug,
        // Send both existing tag IDs and new tag names
        tagIds: formData.tagIds || [],
        newTagNames: formData.newTagNames || []
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save post');
      }

      toast.success(`Post ${isEdit ? 'updated' : 'created'} successfully`);
      setShowCreateModal(false);
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(error.message || 'Failed to save post');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      fetchPosts();
    }, 500);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Draft';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e) => {
    const newPageSize = parseInt(e.target.value, 10);
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (totalPages <= 1 && totalItems <= pageSize) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Items per page:</span>
          <select
            value={pageSize}
            onChange={handleItemsPerPageChange}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</span> to{' '}
          <span className="font-medium">
            {Math.min(currentPage * pageSize, totalItems)}
          </span>{' '}
          of <span className="font-medium">{totalItems}</span> results
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`px-2 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            title="First Page"
          >
            «
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            title="Previous Page"
          >
            <HiOutlineChevronLeft className="h-5 w-5" />
          </button>

          {currentPage > 3 && totalPages > 3 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 border rounded hover:bg-gray-50"
              >
                1
              </button>
              {currentPage > 4 && <span className="px-2 py-1">...</span>}
            </>
          )}

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 border rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
              >
                {pageNum}
              </button>
            );
          })}

          {currentPage < totalPages - 2 && totalPages > 5 && (
            <>
              {currentPage < totalPages - 3 && <span className="px-2 py-1">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 border rounded hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            title="Next Page"
          >
            <HiOutlineChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            title="Last Page"
          >
            »
          </button>
        </div>
      </div>
    );
  };

  return (
  <div className="flex h-screen bg-gray-50">
          <SellerSidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <SellerTopbar />
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Blog Posts</h1>
        <button
          onClick={() => {
            setEditingPost(null);
            setShowCreateModal(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <HiOutlinePlus className="mr-2" />
          Create New Post
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
            <button
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => {
                setSelectedCategory('');
                setSelectedStatus('');
                setSearchTerm('');
              }}
            >
              <HiOutlineFilter className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post.postId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                            <div className="text-sm text-gray-500">/{post.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {post.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(post.publishedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(post.viewCount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleView(post.postId)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                          >
                            <HiOutlineEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(post.postId)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <HiOutlinePencilAlt className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.postId)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <HiOutlineTrash className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handlePublishToggle(post.postId, post.isPublished)}
                            className={`px-2 py-1 text-xs rounded ${
                              post.isPublished
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                            title={post.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {post.isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No posts found. Create your first post!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {renderPagination()}
      </div>

      {showCreateModal && (
        <PostEditorModal
          post={editingPost}
          categories={categories}
          tags={tags}
          onClose={() => {
            setShowCreateModal(false);
            setEditingPost(null);
          }}
          onSave={handleSavePost}
        />
      )}

      {showViewModal && viewingPost && (
        <PostViewModal
          post={viewingPost}
          onClose={() => {
            setShowViewModal(false);
            setViewingPost(null);
          }}
        />
      )}
    </main>
    </div>
    </div>
  );
};

// Component Modal xem bài viết
const PostViewModal = ({ post, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Draft';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return 'Invalid date';
    }
  };

  const renderMarkdownAsHtml = (content) => {
    // Simple markdown to HTML conversion for preview
    let html = content
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3 mt-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      .replace(/\n/gim, '<br>');
    
    return `<p class="mb-4">${html}</p>`;
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">View Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
          >
            <HiOutlineX className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header Info */}
            <div className="border-b pb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600" >
                <span>Category: <span style={{color:'rgb(30 64 175 / var(--tw-text-opacity))'}}>{post.category?.name || 'Uncategorized'}</span></span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
                <span>Views: {(post.viewCount || 0).toLocaleString()}</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {post.isPublished ? `Published: ${formatDate(post.publishedDate)}` : 'Not published yet'}
              </div>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Content</h3>
              <div 
                className="prose max-w-none bg-gray-50 p-4 rounded-md border"
                dangerouslySetInnerHTML={{ __html: renderMarkdownAsHtml(post.content) }}
              />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag.tagId}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
        </div>

        

        <div className="bg-gray-50 px-6 py-3 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const PostEditorModal = ({ post, categories = [], tags = [], onClose, onSave }) => {
  const [tagInput, setTagInput] = useState('');
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [errors, setErrors] = useState({});

  const [selectedTags, setSelectedTags] = useState(() => {
    // If post is being edited, use the selectedTagNames passed from the parent component
    if (post && post.selectedTagNames) {
      return post.selectedTagNames;
    }
    return [];
  });

  const [formData, setFormData] = useState(() => ({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '## Write your post content here\n\nYou can use markdown to format your content.',
    categoryId: post?.categoryId || '',
    isPublished: post?.isPublished || false,
    tagIds: post?.tagIds || []
  }));

  useEffect(() => {
    // Populate form with post data when editingPost changes
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        categoryId: post.categoryId || '',
        isPublished: post.isPublished || false,
        tagIds: post.tagIds || []
      });
      setSelectedTags(post.selectedTagNames || []);
    } else {
      setFormData({
        title: '',
        slug: '',
        content: '## Write your post content here\n\nYou can use markdown to format your content.',
        categoryId: '',
        isPublished: false,
        tagIds: []
      });
      setSelectedTags([]);
    }
    setErrors({});
  }, [post]);

  useEffect(() => {
    if (categories.length > 0 && !formData.categoryId) {
      setFormData(prev => ({
        ...prev,
        categoryId: categories[0].categoryId.toString()
      }));
    }
  }, [categories, formData.categoryId]);

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    // Slug validation
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (formData.slug.trim().length < 3) {
      newErrors.slug = 'Slug must be at least 3 characters long';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters long';
    }

    // Category validation
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    // Tags validation
    if (selectedTags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    } else if (selectedTags.length > 10) {
      newErrors.tags = 'Maximum 10 tags allowed';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);

    if (value) {
      const filtered = tags
        .filter(tag =>
          tag.name.toLowerCase().includes(value.toLowerCase()) &&
          !selectedTags.includes(tag.name)
        )
        .slice(0, 5);
      setSuggestedTags(filtered);
    } else {
      setSuggestedTags([]);
    }
  };

  const handleAddTag = (tag) => {
    if (tag && !selectedTags.includes(tag)) {
      if (selectedTags.length >= 10) {
        toast.error('Maximum 10 tags allowed');
        return;
      }
      setSelectedTags([...selectedTags, tag]);
      setTagInput('');
      setSuggestedTags([]);
      // Clear tag error if it exists
      if (errors.tags) {
        setErrors(prev => ({ ...prev, tags: '' }));
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e) => {
    if (['Enter', ','].includes(e.key)) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !selectedTags.includes(newTag)) {
        handleAddTag(newTag);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto-generate slug from title if slug is empty
    if (name === 'title' && !formData.slug) {
      const generatedSlug = generateSlug(value);
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: generatedSlug
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix all validation errors before submitting');
      return;
    }

    // Separate existing tags and new tags
    const existingTagIds = [];
    const newTagNames = [];

    selectedTags.forEach(tagName => {
      const found = tags.find(t => t.name === tagName);
      if (found) {
        existingTagIds.push(found.tagId);
      } else {
        newTagNames.push(tagName);
      }
    });

    const dataToSave = {
      ...formData,
      tagIds: existingTagIds,
      newTagNames: newTagNames,
      categoryId: formData.categoryId ? parseInt(formData.categoryId, 10) : null,
      isPublished: formData.isPublished || false,
      slug: formData.slug.trim(),
      title: formData.title.trim(),
      content: formData.content.trim()
    };

    onSave(dataToSave);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {post ? 'Edit Post' : 'Create New Post'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
          >
            <HiOutlineX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${
                  errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter post title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  /blog/
                </span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border focus:outline-none focus:ring-2 ${
                    errors.slug ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="post-url-slug"
                />
              </div>
              {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
              <p className="mt-1 text-xs text-gray-500">Only lowercase letters, numbers, and hyphens allowed</p>
            </div>

            {/* Category and Tags Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-2 sm:text-sm rounded-md ${
                    errors.categoryId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          <span className="sr-only">Remove tag</span>
                          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Type to search or add tags..."
                      className={`block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 ${
                        errors.tags ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />

                    {suggestedTags.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border">
                        {suggestedTags.map(tag => (
                          <div
                            key={tag.tagId}
                            onClick={() => handleAddTag(tag.name)}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            {tag.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    Press Enter or comma to add a tag. Maximum 10 tags allowed.
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                value={formData.content}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 font-mono text-sm ${
                  errors.content ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Write your post content here..."
              />
              {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Supports markdown formatting. {formData.content.length} characters.{' '}
                <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Markdown Cheat Sheet
                </a>
              </p>
            </div>

            {/* Publish Checkbox */}
            <div className="flex items-center">
              <input
                id="isPublished"
                name="isPublished"
                type="checkbox"
                checked={formData.isPublished}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                Publish this post immediately
              </label>
            </div>
          </div>
        </form>

        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
          >
            {post ? 'Update Post' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
          {post && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                  // You might want to add delete functionality here or call a parent function
                  onClose();
                }
              }}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-red-700 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePosts;