import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import MessageBox from '../components/MessageBox';
import SkeletonProductEdit from '../components/skeletons/SkeletonProductEdit';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

export default function ProductEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [from, setFrom] = useState('');
  const [finish, setFinish] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setFrom(data.from);
        setFinish(data.finish);
        setDescription(data.description);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          images,
          category,
          from,
          finish,
          countInStock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Product updated successfully', {
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate('/admin/products');
      }, 1000);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success('Image uploaded successfully. click Update to apply it', {
        autoClose: 1000,
      });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };

  const deleteFileHandler = async (fileName, f) => {
    console.log(fileName, f);
    console.log(images);
    console.log(images.filter((x) => x !== fileName));
    setImages(images.filter((x) => x !== fileName));
    toast.success('Image removed successfully. click Update to apply it');
  };

  return (
    <Container className='small-screen'>
      <Helmet>
        <title>Edit Product ${productId}</title>
      </Helmet>
      <br />
      <h4 className='box'>Edit Product {productId}</h4>

      {loading ? (
        <SkeletonProductEdit delay={1000} />
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='slug'>
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='image'>
            <Form.Label>Image File</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='imageFile'>
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type='file' onChange={uploadFileHandler} />
            {loadingUpload && <SkeletonProductEdit delay={1000} />}
          </Form.Group>

          <Form.Group className='mb-3' controlId='additionalImage'>
            <Form.Label>Additional Images</Form.Label>
            {images.length === 0 && <MessageBox>No image</MessageBox>}
            <ListGroup variant='flush'>
              {images.map((x) => (
                <ListGroup.Item key={x}>
                  {x}
                  <Button variant='light' onClick={() => deleteFileHandler(x)}>
                    <i className='fa fa-times-circle'></i>
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>

          <Form.Group className='mb-3' controlId='additionalImageFile'>
            <Form.Label>Upload Additional Image</Form.Label>
            <Form.Control
              type='file'
              onChange={(e) => uploadFileHandler(e, true)}
            />
            {loadingUpload && <SkeletonProductEdit delay={1000} />}
          </Form.Group>

          <Form.Group className='mb-3' controlId='category'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='from'>
            <Form.Label>From</Form.Label>
            <Form.Control
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='finish'>
            <Form.Label>Finish</Form.Label>
            <Form.Control
              value={finish}
              onChange={(e) => setFinish(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='countInStock'>
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <div className='mb-3'>
            <Button disabled={loadingUpdate} type='submit'>
              Update
            </Button>
            {loadingUpdate && <SkeletonProductEdit delay={1000} />}
          </div>
        </Form>
      )}
      <br />
    </Container>
  );
}
