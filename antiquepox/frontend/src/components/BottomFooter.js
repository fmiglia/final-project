import React from 'react';
import { Row, Col } from 'react-bootstrap';

const BottomFooter = () => {
  return (
    <div className='bottom-footer'>
      <Row>
        <Col className='text-center'>
          This Web app is developed by{' '}
          <a
            href='#'
            target='_blank'
            rel='noopener noreferrer'
            id='linked'
          >
            &copy; Illmiglia.com
          </a>
        </Col>
      </Row>
    </div>
  );
};

export default BottomFooter;
