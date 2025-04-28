import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function Signin() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
        password,
      });

      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));

      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className='content'>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <br />
      <h4 className='box'>Sign In</h4>
      <Row>
        <Col md={6}>
          <Form onSubmit={submitHandler} className='box'>
            <Form.Group className='mb-3' controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='email'
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Minimum length 8, 1 uppercase, 1 lowercase, 1 digit, and 1 special character'
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className='mb-3'>
              <Button type='submit'>Sign In</Button>
            </div>

            <div className='mb-3'>
              New customer?{' '}
              <Link to={`/signup?redirect=${redirect}`}>
                Create your account
              </Link>
            </div>
            <div className='mb-3'>
              Forget Password?{' '}
              <Link to={`/forget-password`}>Reset Password</Link>
            </div>
          </Form>
        </Col>

        <Col md={6}>
          <img src='/images/signin.png' alt='signin' className='img-fluid' />
        </Col>
      </Row>
    </div>
  );
}
