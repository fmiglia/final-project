import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Badge, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import SearchBox from '../components/SearchBox';

function Header() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  const [categories, setCategories] = useState([]);
  const [messagesCount, setMessagesCount] = useState(0);
  const [summaryData, setSummaryData] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  // Fetch messages count and orders summary on userInfo change
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userInfo && userInfo.token) {
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`, // Set Authorization header with user token
            },
          };

          // Fetch messages count
          const messagesResponse = await axios.get('/api/messages', config);
          setMessagesCount(messagesResponse.data.length); // Set messagesCount state with fetched count

          // Fetch orders count
          const summaryResponse = await axios.get(
            '/api/orders/summary',
            config
          );
          setSummaryData(summaryResponse.data.orders); // Set summaryData state with fetched orders data
        }
      } catch (err) {
        toast.error(getError(err)); // Display error message using toast if fetch fails
      }
    };

    fetchData(); // Call fetchData function
  }, [userInfo]); // Dependency array ensures this effect runs when userInfo changes

  return (
    <>
      <header>
        <Navbar className='header' variant='dark' expand='lg'>
          <ToastContainer position='bottom-center' limit={1} />
          <div className="d-flex align-items-center w-100">
            <LinkContainer to='/'>
              <Navbar.Brand>
                <img src='/images/bottiglia+beige.png' alt='logo' style={{ width: '180px', height: 'auto' }}></img>
              </Navbar.Brand>
            </LinkContainer>
            <div style={{ marginLeft: '40px' }}>
              <SearchBox />
            </div>
          </div>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='mr-auto w-100 justify-content-end'>
              <NavDropdown title='About Us' id='basic-nav-dropdown'>
                <NavDropdown.Item href='/about'>About Us</NavDropdown.Item>
                <NavDropdown.Item href='/contact'>Contact Us</NavDropdown.Item>
                <NavDropdown.Item href='/design'>Design</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href='/askedQuestions'>FAQ</NavDropdown.Item>
              </NavDropdown>

              {/* Categories on mobile */}
              <NavDropdown
                className='nav-categories' // hides categories in desktop
                title='Categories'
                id='basic-nav-dropdown'
              >
                <Nav className='flex-column p-2'>
                  {categories.map((category) => (
                    <Nav.Item key={category}>
                      <LinkContainer to={`/search?category=${category}`}>
                        <Nav.Link className='text-dark'>{category}</Nav.Link>
                      </LinkContainer>
                    </Nav.Item>
                  ))}
                </Nav>
              </NavDropdown>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id='basic-nav-dropdown'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>User Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/orderhistory'>
                    <NavDropdown.Item>Order History</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <Link
                    className='dropdown-item'
                    to='#signout'
                    onClick={signoutHandler}
                  >
                    Sign Out
                  </Link>
                </NavDropdown>
              ) : (
                <Link className='nav-link' to='/signin'>
                  <i class='fas fa-sign-in-alt'></i> Sign In
                </Link>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='admin-nav-dropdown'>
                  <LinkContainer to='/admin/dashboard'>
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/products'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/users'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>

                  {/* lesson 11 */}
                  {/* Orders link with badge */}
                  <LinkContainer to='/admin/orders'>
                    <NavDropdown.Item>
                      Orders{' '}
                      {summaryData && summaryData[0] && (
                        // if orders is greater than zero then display the success pill
                        <Badge pill bg='success'>
                          {summaryData[0].numOrders}
                        </Badge>
                      )}
                    </NavDropdown.Item>
                  </LinkContainer>
                  {/* Messages link with badge */}
                  <LinkContainer to='/admin/messages'>
                    <NavDropdown.Item>
                      Messages{' '}
                      {messagesCount > 0 && (
                        // if messages is greater than zero then display the success pill
                        <Badge pill bg='success'>
                          {messagesCount}
                        </Badge>
                      )}
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}

              <Link to='/cart' className='nav-link d-flex align-items-center'>
                <i className='fa fa-shopping-cart me-2'></i> Cart
                {cart.cartItems.length > 0 && (
                  <Badge pill bg='danger' className='ms-2'>
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    </>
  );
}

export default Header;
