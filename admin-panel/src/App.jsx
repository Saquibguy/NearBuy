import { useEffect, useState } from 'react';
import logo from '../../assets/images/icon.png';
import './App.css';

const API_URL = 'https://nearbuy-backend-gzbq.onrender.com';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('adminLoggedIn') === 'true'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activePage, setActivePage] = useState('dashboard');
  const [apiStatus, setApiStatus] = useState('Not checked');
  const [apiChecking, setApiChecking] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  const [sellers, setSellers] = useState([]);
  const [sellersLoading, setSellersLoading] = useState(false);
  const [sellersError, setSellersError] = useState('');
  const [sellerSearch, setSellerSearch] = useState('');

  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState('');
  const [requestSearch, setRequestSearch] = useState('');

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoginError('');

    if (!email || !password) {
      setLoginError('Please enter email and password.');
      return;
    }

    try {
      setLoginLoading(true);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: 'admin',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      // Support both response formats used by the NearBuy backend:
      // { success: true, data: { user: {...} } }
      // and { success: true, user: {...} }
      const adminUser = data.data?.user || data.data || data.user || {};

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Login failed.');
      }

      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminUser', JSON.stringify(adminUser));

      setActivePage('dashboard');
      setIsLoggedIn(true);
      setLoginError('');
      setEmail('');
      setPassword('');

      // Reload the app so the dashboard opens reliably.
      window.location.replace('/');
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    setIsLoggedIn(false);
    setActivePage('dashboard');
  };

  const loadCustomers = async () => {
    try {
      setCustomersLoading(true);
      setCustomersError('');

      const response = await fetch(
        `${API_URL}/api/admin/customers`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to load customers.'
        );
      }

      setCustomers(data.customers || []);
    } catch (error) {
      setCustomersError(error.message);
    } finally {
      setCustomersLoading(false);
    }
  };

  const loadSellers = async () => {
    try {
      setSellersLoading(true);
      setSellersError('');

      const response = await fetch(
        `${API_URL}/api/admin/sellers`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to load sellers.'
        );
      }

      setSellers(data.sellers || []);
    } catch (error) {
      setSellersError(error.message);
    } finally {
      setSellersLoading(false);
    }
  };

  const loadRequests = async () => {
    try {
      setRequestsLoading(true);
      setRequestsError('');

      const response = await fetch(
        `${API_URL}/api/admin/requests`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to load requests.'
        );
      }

      setRequests(data.requests || []);
    } catch (error) {
      setRequestsError(error.message);
    } finally {
      setRequestsLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError('');

      const response = await fetch(
        `${API_URL}/api/admin/orders`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to load orders.'
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      setOrdersError(error.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    if (activePage === 'customers') {
      loadCustomers();
    }

    if (activePage === 'sellers') {
      loadSellers();
    }

    if (activePage === 'requests') {
      loadRequests();
    }

    if (activePage === 'orders') {
      loadOrders();
    }
  }, [activePage, isLoggedIn]);

  const filteredCustomers = customers.filter((customer) => {
    const search = customerSearch.toLowerCase();

    return (
      customer.name?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.phone?.toLowerCase().includes(search)
    );
  });

  const filteredSellers = sellers.filter((seller) => {
    const search = sellerSearch.toLowerCase();

    return (
      seller.name?.toLowerCase().includes(search) ||
      seller.email?.toLowerCase().includes(search) ||
      seller.phone?.toLowerCase().includes(search) ||
      seller.shopName?.toLowerCase().includes(search) ||
      seller.category?.toLowerCase().includes(search)
    );
  });

  const filteredRequests = requests.filter((request) => {
    const search = requestSearch.toLowerCase();

    return (
      request.productName?.toLowerCase().includes(search) ||
      request.category?.toLowerCase().includes(search) ||
      request.location?.toLowerCase().includes(search) ||
      request.customerId?.name
        ?.toLowerCase()
        .includes(search)
    );
  });

  const filteredOrders = orders.filter((order) => {
    const search = orderSearch.toLowerCase();

    return (
      order.productName?.toLowerCase().includes(search) ||
      order.customerId?.name
        ?.toLowerCase()
        .includes(search) ||
      order.sellerId?.name
        ?.toLowerCase()
        .includes(search) ||
      order.sellerId?.shopName
        ?.toLowerCase()
        .includes(search) ||
      order.status?.toLowerCase().includes(search)
    );
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
      case 'Confirmed':
        return 'status-active';

      case 'Completed':
        return 'status-completed';

      case 'Cancelled':
        return 'status-cancelled';

      case 'Pending':
        return 'status-pending';

      default:
        return 'status-default';
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderDashboard = () => {
    const totalCustomers = customers.length;
    const totalSellers = sellers.length;
    const totalRequests = requests.length;
    const totalOrders = orders.length;

    return (
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Overview of your NearBuy platform.</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div>
              <span>Total Customers</span>
              <h2>{totalCustomers}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏪</div>
            <div>
              <span>Total Sellers</span>
              <h2>{totalSellers}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div>
              <span>Total Requests</span>
              <h2>{totalRequests}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div>
              <span>Total Orders</span>
              <h2>{totalOrders}</h2>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2>NearBuy Admin Panel</h2>
              <p>
                Manage customers, sellers, product requests and
                orders from one place.
              </p>
            </div>
          </div>

          <div className="quick-actions">
            <button
              onClick={() => setActivePage('customers')}
              className="quick-action"
            >
              <span>👤</span>
              <div>
                <strong>Customers</strong>
                <small>View registered customers</small>
              </div>
            </button>

            <button
              onClick={() => setActivePage('sellers')}
              className="quick-action"
            >
              <span>🏪</span>
              <div>
                <strong>Sellers</strong>
                <small>View registered shops</small>
              </div>
            </button>

            <button
              onClick={() => setActivePage('requests')}
              className="quick-action"
            >
              <span>📋</span>
              <div>
                <strong>Requests</strong>
                <small>View customer requests</small>
              </div>
            </button>

            <button
              onClick={() => setActivePage('orders')}
              className="quick-action"
            >
              <span>🛒</span>
              <div>
                <strong>Orders</strong>
                <small>View confirmed orders</small>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCustomers = () => (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>Manage registered NearBuy customers.</p>
        </div>

        <button
          className="refresh-button"
          onClick={loadCustomers}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="content-card">
        <div className="table-toolbar">
          <div>
            <h2>Customer List</h2>
            <span>{filteredCustomers.length} customers</span>
          </div>

          <input
            type="text"
            placeholder="Search customers..."
            value={customerSearch}
            onChange={(e) =>
              setCustomerSearch(e.target.value)
            }
            className="search-input"
          />
        </div>

        {customersLoading ? (
          <div className="empty-state">
            <div className="loader"></div>
            <p>Loading customers...</p>
          </div>
        ) : customersError ? (
          <div className="error-state">
            <p>{customersError}</p>
            <button onClick={loadCustomers}>
              Try Again
            </button>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>No customers found</h3>
            <p>
              There are no customers matching your search.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar">
                          {customer.name
                            ?.charAt(0)
                            .toUpperCase() || 'C'}
                        </div>

                        <div>
                          <strong>
                            {customer.name || 'Unknown'}
                          </strong>
                        </div>
                      </div>
                    </td>

                    <td>{customer.email || '-'}</td>
                    <td>{customer.phone || '-'}</td>
                    <td>
                      {formatDate(customer.createdAt)}
                    </td>

                    <td>
                      <span className="status-badge status-active">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderSellers = () => (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Sellers</h1>
          <p>Manage registered shops and sellers.</p>
        </div>

        <button
          className="refresh-button"
          onClick={loadSellers}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="content-card">
        <div className="table-toolbar">
          <div>
            <h2>Seller List</h2>
            <span>{filteredSellers.length} sellers</span>
          </div>

          <input
            type="text"
            placeholder="Search sellers..."
            value={sellerSearch}
            onChange={(e) =>
              setSellerSearch(e.target.value)
            }
            className="search-input"
          />
        </div>

        {sellersLoading ? (
          <div className="empty-state">
            <div className="loader"></div>
            <p>Loading sellers...</p>
          </div>
        ) : sellersError ? (
          <div className="error-state">
            <p>{sellersError}</p>
            <button onClick={loadSellers}>
              Try Again
            </button>
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏪</div>
            <h3>No sellers found</h3>
            <p>
              There are no sellers matching your search.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Shop</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredSellers.map((seller) => (
                  <tr key={seller._id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar seller-avatar">
                          {seller.name
                            ?.charAt(0)
                            .toUpperCase() || 'S'}
                        </div>

                        <div>
                          <strong>
                            {seller.name || 'Unknown'}
                          </strong>
                          <small>{seller.email}</small>
                        </div>
                      </div>
                    </td>

                    <td>{seller.shopName || '-'}</td>
                    <td>{seller.category || '-'}</td>

                    <td>
                      {[
                        seller.area,
                        seller.city,
                      ]
                        .filter(Boolean)
                        .join(', ') || '-'}
                    </td>

                    <td>{seller.phone || '-'}</td>

                    <td>
                      {formatDate(seller.createdAt)}
                    </td>

                    <td>
                      <span className="status-badge status-active">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Requests</h1>
          <p>View customer product requests.</p>
        </div>

        <button
          className="refresh-button"
          onClick={loadRequests}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="content-card">
        <div className="table-toolbar">
          <div>
            <h2>Product Requests</h2>
            <span>{filteredRequests.length} requests</span>
          </div>

          <input
            type="text"
            placeholder="Search requests..."
            value={requestSearch}
            onChange={(e) =>
              setRequestSearch(e.target.value)
            }
            className="search-input"
          />
        </div>

        {requestsLoading ? (
          <div className="empty-state">
            <div className="loader"></div>
            <p>Loading requests...</p>
          </div>
        ) : requestsError ? (
          <div className="error-state">
            <p>{requestsError}</p>
            <button onClick={loadRequests}>
              Try Again
            </button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No requests found</h3>
            <p>
              There are no product requests matching your
              search.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Budget</th>
                  <th>Qty</th>
                  <th>Location</th>
                  <th>Condition</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request._id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar">
                          {request.customerId?.name
                            ?.charAt(0)
                            .toUpperCase() || 'C'}
                        </div>

                        <div>
                          <strong>
                            {request.customerId?.name ||
                              'Unknown'}
                          </strong>

                          <small>
                            {request.customerId?.email ||
                              ''}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong>
                        {request.productName || '-'}
                      </strong>
                    </td>

                    <td>{request.category || '-'}</td>

                    <td>
                      ₹
                      {Number(
                        request.budget || 0
                      ).toLocaleString('en-IN')}
                    </td>

                    <td>{request.quantity || '-'}</td>

                    <td>{request.location || '-'}</td>

                    <td>{request.condition || '-'}</td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          request.status
                        )}`}
                      >
                        {request.status || 'Unknown'}
                      </span>
                    </td>

                    <td>
                      {formatDate(request.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>View orders created through accepted offers.</p>
        </div>

        <button
          className="refresh-button"
          onClick={loadOrders}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="content-card">
        <div className="table-toolbar">
          <div>
            <h2>Order List</h2>
            <span>{filteredOrders.length} orders</span>
          </div>

          <input
            type="text"
            placeholder="Search orders..."
            value={orderSearch}
            onChange={(e) =>
              setOrderSearch(e.target.value)
            }
            className="search-input"
          />
        </div>

        {ordersLoading ? (
          <div className="empty-state">
            <div className="loader"></div>
            <p>Loading orders...</p>
          </div>
        ) : ordersError ? (
          <div className="error-state">
            <p>{ordersError}</p>
            <button onClick={loadOrders}>
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>No orders found</h3>
            <p>
              There are no orders matching your search.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Seller</th>
                  <th>Shop</th>
                  <th>Price</th>
                  <th>Condition</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div>
                        <strong>
                          {order.productName || 'Order'}
                        </strong>

                        <small>
                          #{order._id?.slice(-8)}
                        </small>
                      </div>
                    </td>

                    <td>
                      <div className="user-cell">
                        <div className="avatar">
                          {order.customerId?.name
                            ?.charAt(0)
                            .toUpperCase() || 'C'}
                        </div>

                        <div>
                          <strong>
                            {order.customerId?.name ||
                              'Unknown'}
                          </strong>

                          <small>
                            {order.customerId?.phone ||
                              ''}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      {order.sellerId?.name || 'Unknown'}
                    </td>

                    <td>
                      {order.sellerId?.shopName || '-'}
                    </td>

                    <td>
                      <strong>
                        ₹
                        {Number(
                          order.price || 0
                        ).toLocaleString('en-IN')}
                      </strong>
                    </td>

                    <td>
                      {order.condition || '-'}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status || 'Unknown'}
                      </span>
                    </td>

                    <td>
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const checkApiStatus = async () => {
    try {
      setApiChecking(true);
      setApiStatus('Checking...');

      const response = await fetch(`${API_URL}/`);

      if (!response.ok) {
        throw new Error('Backend is not responding correctly.');
      }

      setApiStatus('Connected');
    } catch (error) {
      setApiStatus('Not connected');
    } finally {
      setApiChecking(false);
    }
  };

  const renderSettings = () => {
    let savedAdmin = {};

    try {
      savedAdmin = JSON.parse(
        localStorage.getItem('adminUser') || '{}'
      );
    } catch (error) {
      savedAdmin = {};
    }

    return (
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your admin panel information.</p>
          </div>
        </div>

        <div className="settings-grid">
          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon">👤</div>
              <div>
                <h2>Admin Profile</h2>
                <p>Currently signed-in administrator</p>
              </div>
            </div>

            <div className="settings-row">
              <span>Name</span>
              <strong>{savedAdmin.name || 'Administrator'}</strong>
            </div>

            <div className="settings-row">
              <span>Email</span>
              <strong>{savedAdmin.email || email || 'admin@nearbuy.com'}</strong>
            </div>

            <div className="settings-row">
              <span>Role</span>
              <strong>Admin</strong>
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon">🌐</div>
              <div>
                <h2>Backend Status</h2>
                <p>Check the connection to your backend API</p>
              </div>
            </div>

            <div className="settings-row">
              <span>API Status</span>
              <strong className={apiStatus === 'Connected' ? 'settings-success' : 'settings-muted'}>
                {apiStatus}
              </strong>
            </div>

            <div className="settings-row settings-column">
              <span>Backend URL</span>
              <small>{API_URL}</small>
            </div>

            <button
              className="refresh-button"
              onClick={checkApiStatus}
              disabled={apiChecking}
            >
              {apiChecking ? 'Checking...' : 'Check Connection'}
            </button>
          </section>

          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon">ℹ️</div>
              <div>
                <h2>Platform Information</h2>
                <p>Basic information about the NearBuy project</p>
              </div>
            </div>

            <div className="settings-row">
              <span>Application</span>
              <strong>NearBuy</strong>
            </div>

            <div className="settings-row">
              <span>Panel</span>
              <strong>Admin Panel</strong>
            </div>

            <div className="settings-row">
              <span>Version</span>
              <strong>1.0.0</strong>
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderComingSoon = (title) => (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p>Manage your NearBuy platform.</p>
        </div>
      </div>

      <div className="coming-soon-card">
        <div className="empty-icon">⚙️</div>
        <h2>{title}</h2>
        <p>This section will be available soon.</p>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="brand">
            <img className="brand-logo" src={logo} alt="NearBuy logo" />
            <div>
              <h2>NearBuy</h2>
              <span>Admin Panel</span>
            </div>
          </div>

          <div className="login-heading">
            <h1>Welcome back</h1>
            <p>Sign in to manage the platform</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            {loginError && (
              <div className="login-error">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loginLoading}
            >
              {loginLoading
                ? 'Signing in...'
                : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img className="sidebar-logo" src={logo} alt="NearBuy logo" />

          <div>
            <h2>NearBuy</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={
              activePage === 'dashboard'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() =>
              setActivePage('dashboard')
            }
          >
            <span>▣</span>
            Dashboard
          </button>

          <button
            className={
              activePage === 'customers'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() =>
              setActivePage('customers')
            }
          >
            <span>👤</span>
            Customers
          </button>

          <button
            className={
              activePage === 'sellers'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() =>
              setActivePage('sellers')
            }
          >
            <span>🏪</span>
            Sellers
          </button>

          <button
            className={
              activePage === 'requests'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() =>
              setActivePage('requests')
            }
          >
            <span>📋</span>
            Requests
          </button>

          <button
            className={
              activePage === 'orders'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() =>
              setActivePage('orders')
            }
          >
            <span>🛒</span>
            Orders
          </button>

          <button
            className={
              activePage === 'settings'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() =>
              setActivePage('settings')
            }
          >
            <span>⚙️</span>
            Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <span className="topbar-label">
              Administration
            </span>
          </div>

          <div className="admin-user">
            <img className="admin-avatar" src={logo} alt="Admin logo" />

            <div>
              <strong>Administrator</strong>
              <small>Admin</small>
            </div>
          </div>
        </header>

        {activePage === 'dashboard' &&
          renderDashboard()}

        {activePage === 'customers' &&
          renderCustomers()}

        {activePage === 'sellers' &&
          renderSellers()}

        {activePage === 'requests' &&
          renderRequests()}

        {activePage === 'orders' &&
          renderOrders()}

        {activePage === 'settings' &&
          renderSettings()}
      </main>
    </div>
  );
}

export default App;