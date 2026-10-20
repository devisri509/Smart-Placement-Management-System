import React from 'react';
import { Link } from 'react-router-dom';

const BrandMark = ({ to = '/' }) => {
  return (
    <Link to={to} className="brand-mark">
      <span className="brand-logo">SP</span>
      <span className="brand-name">Smart Placement</span>
    </Link>
  );
};

export default BrandMark;
