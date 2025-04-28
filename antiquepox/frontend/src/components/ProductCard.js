import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import { useContext, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';

function ProductCard(props) {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const { handleSidebarOpen } = props;

  const addToCartHandler = async (item) => {
    setSidebarIsOpen(!sidebarIsOpen);
    handleSidebarOpen();

    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });

    setSidebarIsOpen(!sidebarIsOpen);
    handleSidebarOpen({
      autoClose: 2000, // Duration in milliseconds (2 second)
    });

    if (isMobile) {
      toast.success(
        <div>
          <LazyLoad>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '50px', height: '50px', marginRight: '10px' }}
              loading='lazy'
            />
          </LazyLoad>
          <span>{product.name} added to cart</span>
        </div>,
        {
          position: 'bottom-center',
          autoClose: 1000, // Duration in milliseconds (1 second)
        }
      );
    }
  };

  return (
    <Card className='home-card'>
      <Link to={`/product/${product.slug}`}>
        <LazyLoad height={200} offset={100}>
          <img
            src={product.image}
            className='card-img-top'
            alt={product.name}
            loading='lazy'
          />
        </LazyLoad>
      </Link>
      <Card.Body>
        <Link
          to={`/product/${product.slug}`}
          style={{ textDecoration: 'none' }}
        >
          <Card.Title>{product.name}</Card.Title>
          <Card.Title>From: {product.from}</Card.Title>
          <Card.Title>Finish: {product.finish}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant='light' disabled>
            Out of stock
          </Button>
        ) : (
          <Row>
            {/* low quantity alert lesson 12 */}
            <Col xs={8}>
              {product.countInStock <= 5 && (
                <p style={{ color: 'red' }}>
                  Only {product.countInStock} Left, buy Now!
                </p>
              )}
            </Col>
            <Col xs={4}>
              <Button
                className='btn btn-primary btn-sm'
                onClick={() => addToCartHandler(product)}
                disabled={product.quantity < 1}
              >
                {product.quantity < 1 ? 'Out of stock' : 'Add to cart'}
              </Button>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
