import React from "react";
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from "react-icons/ai";

const StarRating = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<AiFillStar key={"full-" + i} className="text-yellow-400 size-10" />);
    }

    if (halfStar) {
      stars.push(<AiTwotoneStar key="half" className="text-yellow-400 size-10" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<AiOutlineStar key={"empty-" + i} className="text-yellow-400 size-10" />);
    }

    return stars;
  };

  return <div className="flex gap-1 mt-6">{renderStars()}</div>;
};

export default StarRating;
