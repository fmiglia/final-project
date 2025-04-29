import React, { useState, useContext } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
} from '@stripe/react-stripe-js';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { Store } from '../Store';

const CheckoutForm = (props) => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [succeeded, setSucceeded] = useState(false);
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState(false);

  const handleStripeSuccess = async (paymentResult) => {
    try {
      props.handleStripeSuccess(paymentResult);
    } catch (err) {}
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    const { data } = await Axios(`/api/stripe/secret/${props.orderId}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    const clientSecret = data.client_secret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: data.order.user.name,
          email: data.order.user.email,
        },
      },
    });

    if (result.error) {
      console.log(result.error.message);
      alert(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        handleStripeSuccess(result.paymentIntent);
        setDisplaySuccessMessage(true);
      }
    }

    setProcessing(false);
  };

  const cardElementStyle = {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      lineHeight: '40px',
    },
    invalid: {
      color: '#9e2146',
    },
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit} className="payment-form">
        <Row className="mb-4">
          <Col>
            <Form.Group>
              <Form.Label className="payment-label">Numero Carta</Form.Label>
              <div className="payment-input">
                <CardNumberElement options={{ style: cardElementStyle }} />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="payment-label">Data di Scadenza</Form.Label>
              <div className="payment-input">
                <CardExpiryElement options={{ style: cardElementStyle }} />
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="payment-label">CVV</Form.Label>
              <div className="payment-input">
                <CardCvcElement options={{ style: cardElementStyle }} />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Button
              type='submit'
              className='payment-button'
              disabled={!stripe || processing || succeeded}
            >
              {processing ? 'Processing...' : 'Pay With Credit Card'}
            </Button>
          </Col>
        </Row>

        {displaySuccessMessage && (
          <Row className="mt-4">
            <Col>
              <div className="payment-success-message">
                Payment Successful.{' '}
                <Link to='/orderhistory'>See it in your purchase history.</Link>
              </div>
            </Col>
          </Row>
        )}
      </Form>
    </Container>
  );
};

const StripeCheckout = (props) => (
  <Elements stripe={props.stripe}>
    <CheckoutForm
      orderId={props.orderId}
      handleStripeSuccess={props.handleStripeSuccess}
    />
  </Elements>
);

export default StripeCheckout;
