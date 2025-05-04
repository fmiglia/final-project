import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <Row>
        <Col md={4}>
          Stay in touch
          <div className='socialIcon'>
            <ul className='list-unstyled'>
              <li>
                <a
                  href='https://www.facebook.com/'
                  className='facebookIcon'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <i className='fab fa-facebook'></i> Facebook
                </a>
              </li>

              <li>
                <a
                  href='https://www.youtube.com/channel/'
                  className='youtubeIcon'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <i className='fab fa-youtube'></i> YouTube
                </a>
              </li>
            </ul>
          </div>
        </Col>

        <Col md={4}>
          Get To Know Us
          <div className='socialIcon'>
            <ul className='list-unstyled'>
              <li>
                <Link to='/about' className='email'>
                  {' '}
                  <i className='fa fa-info'></i> About Us
                </Link>
              </li>
              <li>
                <Link to='/gallery' className='email'>
                  {' '}
                  <i className='fa fa-info'></i> Antique Gallery
                </Link>
              </li>
              <li>
                <Link to='/design' className='email'>
                  {' '}
                  <i className='fa fa-info'></i> Design
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={4}>
          Merchandise Questions
          <div className='socialIcon'>
            <ul className='list-unstyled'>
              <Link to='/contact' className='email'>
                <i className='fa fa-envelope'></i> Contact Us
              </Link>
              <li>
                {/* use your email */}
                <a href='mailto:gabudemy@gmail.com' className='email'>
                  <i className='fa fa-envelope'></i> Email Me via gmail
                </a>
              </li>
              <li>
                <Link to='/askedQuestions' className='email'>
                  {' '}
                  <i className='fa fa-info'></i> FAQ
                </Link>
              </li>
            </ul>
          </div>
        </Col>
      </Row>

      <hr className='hrLine' />

      <Row>
        <Col className='text-center mt-3'>
          &copy;{new Date().getFullYear()} ~ ANTIQUEPOX ~
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
