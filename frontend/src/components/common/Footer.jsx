import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-3 text-center mt-10">
      © {new Date().getFullYear()} DevConnect | Built with ❤️
    </footer>
  );
};

export default Footer;
