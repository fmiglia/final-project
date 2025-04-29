import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Skeleton from './Skeleton';

const SkeletonOrderHistory = () => {
  const isMobile = window.innerWidth <= 768; // Set your mobile breakpoint here

  return (
    <div>
      <br />
      {isMobile ? (
        <Row className='box col-12'>
          {/* mobile view */}
          <Col className='left-col col-4'>
            <Skeleton classes='square' />
          </Col>
          <Col className='right-col col-8'>
            <Skeleton classes='title width-100 skeleton-title' />
            <Skeleton classes='text width-100 skeleton-text' />
          </Col>
          <Col className='right-col col-8' style={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ 
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              <Skeleton classes='title width-100 skeleton-title' />
            </div>
            <div style={{ 
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              <Skeleton classes='text width-100 skeleton-text' />
            </div>
          </Col>
        </Row>
      ) : (
        <Row className='box col-12'>
          {/* desktop skeleton */}
          <Col className='left-col col-2'>
            <Skeleton classes='square' />
          </Col>
          <Col className='right-col col-10'>
            <Skeleton classes='title width-100 skeleton-title' />
            <Skeleton classes='text width-100 skeleton-text' />
          </Col>
        </Row>
      )}
      <br />
    </div>
  );
};

export default SkeletonOrderHistory;
