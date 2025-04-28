import { useContext, useEffect } from 'react';
import { Store } from '../Store'; // Importing Store context
import { Row, Col, ListGroup } from 'react-bootstrap'; // Importing React Bootstrap components
import { useNavigate } from 'react-router-dom'; // Importing useNavigate from react-router-dom

const Sidebar = ({ handleSidebarOpen }) => {
  const navigate = useNavigate(); // Initializing navigate for routing
  const { state, dispatch: ctxDispatch } = useContext(Store); // Using useContext to access state and dispatch from Store context
  const {
    cart: { cartItems }, // Destructuring cartItems from state
  } = state;

  const imageStyle = {
    width: '100%', // Setting image width to 100%
    height: 'auto', // Setting image height to auto for aspect ratio
    objectFit: 'cover', // Ensuring image covers the container
  };

  useEffect(() => {
    handleSidebarOpen(); // Calling handleSidebarOpen when component mounts
    const timer = setTimeout(() => {
      handleSidebarOpen(); // Call the handleSidebarOpen function after the specified duration (2 seconds)
    }, 2000);

    return () => {
      clearTimeout(timer); // Clearing the timer when component unmounts or rerenders
    };
  }, []); // Empty dependency array to run effect only once on mount

  return (
    <div className='content'>
      {/* Main content wrapper */}
      <br /> {/* Adding line break */}
      <Row>
        {/* Using React Bootstrap Row */}
        <Col>
          {/* Using React Bootstrap Col */}
          {cartItems.length > 0 && ( // Rendering cart items if cartItems array is not empty
            <ListGroup>
              {/* Using React Bootstrap ListGroup */}
              <h4 className='text-center'>Items In Cart</h4>{' '}
              {/* Cart items header */}
              {cartItems.map(
                (
                  item // Mapping through cartItems array
                ) => (
                  <ListGroup.Item key={item._id}>
                    {/* ListGroup item with unique key */}
                    <Col>
                      {/* Nested Col for item details */}
                      <img
                        src={item.image} // Item image source
                        alt={item.name} // Item image alt text
                        className='img-fluid rounded img-thumbnail' // Image classes
                        style={imageStyle} // Inline image style
                      ></img>
                      {/* Render item image */}
                      <span>
                        {/* Item details */}
                        <strong>{item.name}</strong> <br /> {/* Item name */}
                        added to cart {/* Text indicating item added to cart */}
                      </span>
                    </Col>
                    <hr /> {/* Horizontal line */}
                    <Col>Price: ${item.price}</Col> {/* Item price */}
                  </ListGroup.Item>
                )
              )}
            </ListGroup>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Sidebar; // Exporting Sidebar component
