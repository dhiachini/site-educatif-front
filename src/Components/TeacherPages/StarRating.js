import React from "react";

const StarRating = ({ rating }) => {
  const maxStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<i key={i} className="las la-star text-warning"></i>);
  }
  if (hasHalfStar) {
    stars.push(<i key="half" className="las la-star-half-alt text-warning"></i>);
  }

  return <div>{stars}</div>;
};

export default StarRating;