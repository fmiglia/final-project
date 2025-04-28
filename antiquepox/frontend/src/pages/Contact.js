import { useState, useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import SkeletonContact from '../components/skeletons/SkeletonContact';

export default function Contact() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    let newMessage;
    try {
      newMessage = {
        fullName,
        email,
        subject,
        message,
      };
      setLoading(true);
      toast.success('Success, message sent!', { autoClose: 1000 });
      await axios.post(`/api/messages/contact`, newMessage);
    } catch (err) {
      toast.error('Message not sent', { autoClose: 1000 });
    }
    setLoading(false);
  };

  // lesson 12
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Container>
        {/* lesson 12 */}
        {isLoading ? (
          <SkeletonContact />
        ) : (
          <>
            <Helmet>
              <title>Contact Antiquepox</title>
            </Helmet>
            <br />
            <h4 className='box'>Contact Antiquepox</h4>
            <Form onSubmit={submitHandler}>
              <Form.Group className='mb-3' controlId='name'>
                <Form.Label> Full Name</Form.Label>
                <Form.Control
                  placeholder='full name'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  placeholder='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='subject'>
                <Form.Label>Subject / Item Name</Form.Label>
                <Form.Control
                  placeholder='ex: Ceramic Vase from Country of Origin'
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='message'>
                <Form.Label>Message</Form.Label>
                <Form.Control
                  placeholder='your message'
                  value={message}
                  as='textarea'
                  rows={4}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </Form.Group>

              <div>
                <Button variant='primary' disabled={loading} type='submit'>
                  {loading ? 'Sending...' : 'Submit'}
                </Button>
              </div>
              <br />
            </Form>
          </>
        )}
      </Container>
    </>
  );
}
