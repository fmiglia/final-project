import React, { useState } from 'react';
import { Button, Form, InputGroup, FormControl } from 'react-bootstrap'; // Importing Bootstrap components
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook for navigation

export default function SearchBox() {
  const navigate = useNavigate(); // Initializing useNavigate hook to navigate to different routes
  const [query, setQuery] = useState(''); // State to hold the search query

  // Function to handle form submission
  const submitHandler = (e) => {
    e.preventDefault(); // Preventing default form submission behavior
    navigate(query ? `/search/?query=${query}` : '/search'); // Navigating to search page with query parameter if query exists
  };

  return (
    // Search form component
    <Form className='d-flex me-auto' onSubmit={submitHandler}>
      <InputGroup>
        {/* Search input field */}
        <FormControl
          type='text'
          name='q'
          id='q'
          onChange={(e) => setQuery(e.target.value)} // Updating query state with input value
          placeholder='search products...'
          aria-label='Search Products'
          aria-describedby='button-search'
        ></FormControl>
        {/* Search button */}
        <Button variant='outline-primary' type='submit' id='button-search'>
          <i className='fas fa-search'></i> {/* Search icon */}
        </Button>
      </InputGroup>
    </Form>
  );
}
