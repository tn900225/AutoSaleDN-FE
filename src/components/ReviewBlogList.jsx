import React from "react";
import ReviewBlogCard from "./ReviewBlogCard";

export default function ReviewBlogList({ blogs }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {blogs.map((review) => (
        <ReviewBlogCard key={review.id} review={review} />
      ))}
    </div>
  );
}