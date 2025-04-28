import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Image } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import SkeletonDesign from '../components/skeletons/SkeletonDesign'; // lesson 12

export default function Design() {
  // lesson 12
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (remove this in your actual implementation)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className='content'>
        {/* lesson 12 */}
        {isLoading ? (
          <SkeletonDesign />
        ) : (
          <>
            <Helmet>
              <title>Design Page</title>
            </Helmet>
            <br />
            <Row>
              <Col md={12}>
                <div className='box'>
                  <Image src='/images/antiques.png' alt='design' fluid />
                </div>
                <div className='box'>
                  <h1>Our Design Philosophy</h1>
                  <p>
                    Welcome to our design showcase! We are dedicated to creating
                    unique and innovative designs that reflect our passion for
                    aesthetics and functionality.
                  </p>

                  <p>
                    At our studio, we strive to blend creativity with
                    practicality, offering a range of designs that not only
                    captivate the eye but also enhance the user experience.
                  </p>
                </div>

                <div className='box'>
                  <h1>Functional Beauty</h1>
                  <p>
                    Our designs focus on the harmonious integration of form and
                    function. We believe that beautiful aesthetics should not
                    compromise usability, and vice versa.
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <div className='box'>
                  <h1>Modern Elegance</h1>
                  <p>
                    Explore our collection of modern designs, where simplicity
                    meets sophistication. From sleek furniture to minimalist
                    decor, our creations embody a timeless sense of elegance.
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className='box'>
                  <h1>Innovative Solutions</h1>
                  <p>
                    Delve into our portfolio of innovative solutions, addressing
                    various design challenges. We take pride in crafting designs
                    that not only meet but exceed the expectations of our
                    clients.
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className='box'>
                  <h1>Custom Creations</h1>
                  <p>
                    Discover the world of custom creations, where we bring your
                    unique vision to life. Our team is dedicated to turning your
                    ideas into reality, creating bespoke designs tailored to
                    your preferences.
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className='box'>
                  <h1>Favorite Projects</h1>
                  <p>
                    Our favorite projects showcase a curated selection of
                    designs that hold significant creative value and have made a
                    lasting impact. Visit us to explore these remarkable
                    creations.
                  </p>
                </div>
              </Col>
            </Row>

            <hr />
            <br />
            <Row>
              <Col md={6}>
                <Card>
                  <Image src='/images/antiques.png' alt='antiques' fluid />
                </Card>
              </Col>
              <Col md={6}>
                <div className='box'>
                  <h1>Our Vision</h1>
                  <p>
                    At our design studio, our vision is to redefine aesthetics
                    and functionality through innovative designs. We aim to
                    inspire and elevate spaces by creating designs that resonate
                    with both creators and users alike.
                  </p>
                </div>
              </Col>
            </Row>
            <br />
          </>
        )}
      </div>
    </>
  );
}
