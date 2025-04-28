import React from 'react'; // Import React library
import { Button } from 'react-bootstrap'; // Import Button component from react-bootstrap
import { LinkContainer } from 'react-router-bootstrap'; // Import LinkContainer component from react-router-bootstrap

// Define AdminPagination component
const AdminPagination = ({
  currentPage,
  totalPages,
  isAdmin = true,
  keyword = '',
}) => {
  return (
    <div>
      {/* Generate buttons for each page */}
      {[...Array(totalPages).keys()].map((x) => (
        <LinkContainer
          key={x + 1} // Set a unique key for each LinkContainer
          className='mx-1' // Add margin to the LinkContainer
          to={
            isAdmin && keyword === ''
              ? `/admin/products?page=${x + 1}` // Admin ProductList page
              : !isAdmin && keyword === ''
              ? `/products?page=${x + 1}` // ProductList page
              : isAdmin && keyword === 'OrderList'
              ? `/admin/orders?page=${x + 1}` // Admin OrderList page
              : !isAdmin && keyword === 'OrderList'
              ? `/orders?page=${x + 1}` // OrderList page
              : isAdmin && keyword === 'UserList'
              ? `/admin/users?page=${x + 1}` // Admin UserList page
              : !isAdmin && keyword === 'UserList'
              ? `/users?page=${x + 1}` // UserList page
              : isAdmin && keyword === 'Messages'
              ? `/admin/messages?page=${x + 1}` // Admin Messages page
              : !isAdmin && keyword === 'Messages'
              ? `/messages?page=${x + 1}` // Messages page
              : '/' // Default case
          }
        >
          <Button
            className={currentPage === x + 1 ? 'text-bold' : ''} // Add text-bold class if current page
            variant='light' // Set button variant to light
          >
            {x + 1} {/* Display page number on the button */}
          </Button>
        </LinkContainer>
      ))}
    </div>
  );
};

export default AdminPagination; // Export AdminPagination component
