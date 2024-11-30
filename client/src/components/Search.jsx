import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);

  // Check if the current route is the search page
  useEffect(() => {
    setIsSearchPage(location.pathname === '/search');
  }, [location]);

  const redirectToSearchPage = () => {
    navigate('/search');
  };

  return (
    <div className="rounded-lg border p-2 flex items-center gap-2 bg-sky-500 hover:bg-sky-700">
      {/* Search Icon */}
      <button onClick={redirectToSearchPage} className="text-lg">
        <FaSearch />
      </button>

      {/* Dynamic Content Based on Route */}
      <div className="flex-grow ">
        {isSearchPage ? (
          // Input field for the search page
          <input
            type="text"
            className="w-full p-1 border rounded"
            placeholder="Search for atta, dal, and more"
          />
        ) : (
          // Animated text for other pages
          <div onClick={redirectToSearchPage} className="cursor-pointer ">
            <TypeAnimation
              sequence={[
                'Search "milk"',
                1000,
                'Search "bread"',
                1000,
                'Search "sugar"',
                1000,
                'Search "paneer"',
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
