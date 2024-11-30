import React from 'react';
import logo from '../assets/logo.jpg';
import Search from './Search';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";

const Header = () => {
  const navigate = useNavigate();

  const redirectToLoginPage = () => {
    navigate('/login');
    const user = useSelector((state)=> state.user)
  };

  return (
    <header className="h-20 shadow-md sticky top-0 bg-white z-10">
      {/* Wrapper div for header content */}
      <div className="container mx-auto flex items-center justify-between h-full px-4">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center">
          <img 
            src={logo} 
            alt="logo" 
            className="h-16  w-auto object-contain" // Constrain logo height
          />
        </Link>
        
        {/* Search Section */}
        <div className="flex-1 mx-4">
          <Search />
        </div>

        {/* Login and Cart Section */}
        <div className="flex items-center gap-4">
          {/* Login Icon */}
          <button onClick={redirectToLoginPage}>
            <FaUser size={26} />
          </button>

          {/* Cart Section */}
          <div className="flex items-center bg-green-500 gap-2 px-4 py-2 rounded text-white">
            <button className="p-1 animate-bounce">
              <FaCartShopping size={25} />
            </button>
            <p>My Cart</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
