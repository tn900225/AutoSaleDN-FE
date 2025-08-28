import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { HiOutlineCalendar, HiOutlineTag, HiArrowLeft } from 'react-icons/hi';
import { getApiBaseUrl } from "../../util/apiconfig";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogPostDetail = () => {
    // 1. Sửa: Thay vì lấy 'id', bạn cần lấy 'slug' từ URL.
    const { slug } = useParams();
    const API_BASE = getApiBaseUrl();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                // 2. Sửa: Sử dụng biến 'slug' vừa lấy được để gọi API.
                const response = await fetch(`${API_BASE}/api/user/posts/slug/${slug}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch blog post');
                }
                const data = await response.json();
                setPost(data);
            } catch (error) {
                console.error('Error fetching post:', error);
                toast.error('Failed to load blog post.');
                setPost(null); // Đặt post về null để hiển thị thông báo lỗi
            } finally {
                setLoading(false);
            }
        };

        // 3. Sửa: Kiểm tra biến 'slug' để đảm bảo nó tồn tại trước khi gọi API.
        if (slug) {
            fetchPost();
        }
    // 4. Sửa: Thêm 'slug' vào dependency array để useEffect chạy lại khi slug thay đổi.
    }, [slug]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-center">
                    <p className="text-2xl text-gray-600 mb-4">Không tìm thấy bài viết.</p>
                    <Link to="/blog" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        <HiArrowLeft className="mr-2" />
                        Back blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl bg-white rounded-lg shadow-xl my-8">
            <Link to="/blog" className="inline-flex items-center text-blue-600 hover:underline mb-6">
                <HiArrowLeft className="mr-2" />
                Back blog
            </Link>

            {/* <img
                className="w-full h-96 object-cover object-center rounded-lg mb-6"
                src={post.featuredImage || 'https://via.placeholder.com/1200x600?text=No+Image'}
                alt={post.title}
            /> */}

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                {post.title}
            </h1>
            <div className="flex items-center text-gray-500 mb-6 space-x-4">
                <div className="flex items-center">
                    <HiOutlineCalendar className="mr-1" />
                    <span>{formatDate(post.publishedDate)}</span>
                </div>
                <div className="flex items-center">
                    <HiOutlineTag className="mr-1" />
                    <span className="font-medium">{post.category?.name || 'Uncategorized'}</span>
                </div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <span className="text-gray-600 font-semibold mr-2">Tags:</span>
                    {post.tags.map(tag => (
                        <span
                            key={tag.tagId}
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                        >
                            #{tag.name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogPostDetail;