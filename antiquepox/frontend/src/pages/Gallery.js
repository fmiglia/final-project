import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import SkeletonGallery from '../components/skeletons/SkeletonGallery'; // Import SkeletonGallery component

export default function Gallery() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('/api/products');
        setProducts(result.data);
        setLoading(false); // Set loading to false after data fetching is complete
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setLoading(false); // Set loading to false in case of error
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className='content'>
        <Helmet>
          <title>Gallery</title>
        </Helmet>
        <br />
        <h1 className='box'>Gallery</h1>
        <Row>
          <Col>
            <div className='products'>
              {/* react skeleton for product card 2 rows of 4 skeleton cards */}
              {loading ? (
                <>
                  <Row className="g-0">
                    {[...Array(4).keys()].map((i) => (
                      <Col key={i} xs={6} sm={6} md={4} lg={3} className='p-2'>
                        <SkeletonGallery />
                      </Col>
                    ))}
                  </Row>
                  <Row className="g-0">
                    {[...Array(4).keys()].map((i) => (
                      <Col key={i + 4} xs={6} sm={6} md={4} lg={3} className='p-2'>
                        <SkeletonGallery />
                      </Col>
                    ))}
                  </Row>
                </>
              ) : (
                products.map((product) => (
                  <div className='product' key={product.slug}>
                    <Link to={`/product/${product.slug}`}>
                      <img src={product.image} alt={product.name} />
                    </Link>
                    <div className='product-info'>
                      {/* Link to the individual product page */}
                      <Link to={`/product/${product.slug}`}>
                        <p>{product.name}</p>
                      </Link>
                      {/* <p>
                        <strong>${product.price}</strong>
                      </p>
                      <button>Add to cart</button> */}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
