import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import SkeletonAskedQuestions from '../components/skeletons/SkeletonAskedQuestions';
import { Helmet } from 'react-helmet-async';

export default function AskedQuestions() {
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
        <Helmet>
          <title>FAQ</title>
        </Helmet>
        <br />
        {isLoading ? (
          <SkeletonAskedQuestions />
        ) : (
          <Row>
            <Col md={12}>
              {/* FAQ Item 1 */}
              <div className='box'>
                <h2>What types of products do you offer?</h2>
                <p>
                  We offer a diverse range of products, including furniture,
                  artifacts, ceramics, and Asian antiques. Our collection
                  encompasses various historical and cultural contexts.
                </p>
                <hr />
                {/* FAQ Item 2 */}
                <h2>How can I purchase items from your store?</h2>
                <p>
                  You can purchase items directly from our website. Simply
                  browse our collection, add desired items to your cart, and
                  proceed to checkout. We accept various payment methods for
                  your convenience.
                </p>
                <hr />
                {/* FAQ Item 3 */}
                <h2>Do you offer international shipping?</h2>
                <p>
                  Yes, we offer international shipping. Please note that
                  shipping costs and delivery times may vary depending on the
                  destination. You can view shipping details during the checkout
                  process.
                </p>
                <hr />
                {/* FAQ Item 4 */}
                <h2>Can I return or exchange purchased items?</h2>
                <p>
                  We accept returns and exchanges within 30 days of the purchase
                  date. Please review our return policy for detailed
                  instructions on the process.
                </p>
                <hr />
                {/* FAQ Item 5 */}
                <h2>How do I track my order?</h2>
                <p>
                  Once your order is shipped, you will receive a tracking number
                  via email. You can use this number to track your order on our
                  website or the shipping carrier's site.
                </p>
                <hr />
                {/* FAQ Item 6 */}
                <h2>Are your products handmade?</h2>
                <p>
                  Yes, many of our products are handmade, showcasing the
                  craftsmanship and attention to detail that make each item
                  unique.
                </p>
                <hr />
                {/* FAQ Item 7 */}
                <h2>Do you offer gift cards?</h2>
                <p>
                  Yes, we offer gift cards of varying denominations. They make
                  excellent presents for friends and family who appreciate
                  quality antiques and unique pieces.
                </p>
                <hr />
                {/* FAQ Item 8 */}
                <h2>Can I request a custom order?</h2>
                <p>
                  Absolutely! We welcome custom orders. Contact our customer
                  support team to discuss your ideas and requirements, and we'll
                  work with you to create a bespoke piece.
                </p>
                <hr />
                {/* FAQ Item 9 */}
                <h2>How do I care for antique items?</h2>
                <p>
                  Proper care varies by material, but in general, avoid direct
                  sunlight and extreme temperatures. Regular dusting and gentle
                  cleaning with appropriate products can help preserve the
                  integrity of antique items.
                </p>
                <hr />
                {/* FAQ Item 10 */}
                <h2>What payment methods do you accept?</h2>
                <p>
                  We accept major credit cards, PayPal, and other secure payment
                  methods. Your payment information is encrypted and secure
                  during the transaction.
                </p>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}
