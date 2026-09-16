import { useEffect, useState } from 'react';
import nearbuyLogo from '../../assets/images/icon.png';
import './App.css';

const API_URL = 'https://nearbuy-backend-gzbq.onrender.com';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);

  const [activePage, setActivePage] = useState('dashboard');

  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState('');

  const [statistics, setStatistics] = useState({
    totalCustomers: 0,
    totalSellers: 0,
    totalRequests: 0,
    totalOrders: 0,
  });

  const [recentRequests, setRecentRequests] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  const [sellers, setSellers] = useState([]);
  const [sellersLoading, setSellersLoading] = useState(false);
  const [sellersError, setSellersError] = useState('');
  const [sellerSearch, setSellerSearch] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert('Please enter email and password.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          role: 'admin',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Invalid email or password.');
        return;
      }

      if (!data.user || data.user.role !== 'admin') {
        alert('Access denied. Admin account required.');
        return;
      }

      setAdmin(data.user);
      setLoggedIn(true);
    } catch (error) {
      console.error('Admin login error:', error);
      alert('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    try {
      setDashboardLoading(true);
      setDashboardError('');

      const response = await fetch(
        `${API_URL}/api/admin/dashboard`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to load dashboard.'
        );
      }

      setStatistics(
        data.statistics || {
          totalCustomers: 0,
          totalSellers: 0,
          totalRequests: 0,
          totalOrders: 0,
        }
      );

      setRecentRequests(data.recentRequests || []);
      setRecentOrders(data.recentOrders || []);
    } catch (error) {
      console.error('Dashboard error:', error);

      setDashboardError(
        'Unable to load dashboard data.'
      );
    } finally {
      setDashboardLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      setCustomersLoading(true);
      setCustomersError('');

      const response = await fetch(
        `${API_URL}/api/admin/customers`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to load customers.'
        );
      }

      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Customers error:', error);

      setCustomersError(
        'Unable to load customer data.'
      );
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

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to load sellers.'
        );
      }

      setSellers(data.sellers || []);
    } catch (error) {
      console.error('Sellers error:', error);

      setSellersError(
        'Unable to load seller data.'
      );
    } finally {
      setSellersLoading(false);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      loadDashboard();
    }
  }, [loggedIn]);

  useEffect(() => {
    if (!loggedIn) return;

    if (activePage === 'customers') {
      loadCustomers();
    }

    if (activePage === 'sellers') {
      loadSellers();
    }
  }, [loggedIn, activePage]);

  const handleLogout = () => {
    setLoggedIn(false);
    setAdmin(null);
    setEmail('');
    setPassword('');
    setActivePage('dashboard');

    setCustomers([]);
    setSellers([]);
    setCustomerSearch('');
    setSellerSearch('');
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  const getInitials = (name) => {
    if (!name) return 'CU';

    return name
      .split(' ')
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  const filteredCustomers = customers.filter(
    (customer) => {
      const search = customerSearch
        .toLowerCase()
        .trim();

      if (!search) return true;

      return (
        customer.name
          ?.toLowerCase()
          .includes(search) ||
        customer.email
          ?.toLowerCase()
          .includes(search) ||
        customer.phone
          ?.toLowerCase()
          .includes(search)
      );
    }
  );

  const filteredSellers = sellers.filter(
    (seller) => {
      const search = sellerSearch
        .toLowerCase()
        .trim();

      if (!search) return true;

      return (
        seller.name
          ?.toLowerCase()
          .includes(search) ||
        seller.email
          ?.toLowerCase()
          .includes(search) ||
        seller.phone
          ?.toLowerCase()
          .includes(search) ||
        seller.shopName
          ?.toLowerCase()
          .includes(search) ||
        seller.category
          ?.toLowerCase()
          .includes(search) ||
        seller.area
          ?.toLowerCase()
          .includes(search) ||
        seller.city
          ?.toLowerCase()
          .includes(search)
      );
    }
  );

  if (!loggedIn) {
    return (
      <div className="login-page">

        <div className="login-background-shape shape-one"></div>
        <div className="login-background-shape shape-two"></div>

        <div className="login-card">

          <div className="brand">

            <img
              src={nearbuyLogo}
              alt="NearBuy Logo"
              className="brand-logo"
            />

            <div>
              <h2>NearBuy</h2>
              <span>Admin Panel</span>
            </div>

          </div>

          <div className="login-heading">

            <h1>Welcome back</h1>

            <p>
              Sign in to manage your NearBuy platform.
            </p>

          </div>

          <form onSubmit={handleLogin}>

            <div className="form-group">

              <label>Email Address</label>

              <div className="input-wrapper">

                <span>✉</span>

                <input
                  type="email"
                  placeholder="admin@nearbuy.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>

            <div className="form-group">

              <label>Password</label>

              <div className="input-wrapper">

                <span>●</span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

              </div>

            </div>

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >

              {loading
                ? 'Signing in...'
                : 'Sign In'}

              {!loading && <span>→</span>}

            </button>

          </form>

          <div className="login-footer">
            <span>NearBuy Admin Panel</span>
            <span>v1.0.0</span>
          </div>

        </div>

      </div>
    );
  }

  const renderDashboard = () => (
    <>
      <header className="topbar">

        <div>

          <p className="breadcrumb">
            NearBuy / Dashboard
          </p>

          <h1>Dashboard</h1>

        </div>

        <div className="topbar-right">

          <button className="notification-button">
            ♢
            <span></span>
          </button>

          <div className="top-admin">

            <div className="avatar">
              {admin?.name
                ?.charAt(0)
                .toUpperCase() || 'A'}
            </div>

            <div>

              <strong>
                {admin?.name || 'Administrator'}
              </strong>

              <small>Admin</small>

            </div>

          </div>

        </div>

      </header>

      <section className="welcome-section">

        <div>

          <h2>
            Good to see you,{' '}
            {admin?.name || 'Admin'}!
          </h2>

          <p>
            Here's what's happening across NearBuy today.
          </p>

        </div>

        <div className="date-card">

          <span>Today</span>

          <strong>
            {new Date().toLocaleDateString(
              'en-IN',
              {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }
            )}
          </strong>

        </div>

      </section>

      {dashboardError && (
        <div className="dashboard-error">
          {dashboardError}
        </div>
      )}

      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon blue">
            ♙
          </div>

          <div>

            <span>Total Customers</span>

            <h3>
              {dashboardLoading
                ? '...'
                : statistics.totalCustomers}
            </h3>

            <small>
              Registered customers
            </small>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon green">
            ▣
          </div>

          <div>

            <span>Total Sellers</span>

            <h3>
              {dashboardLoading
                ? '...'
                : statistics.totalSellers}
            </h3>

            <small>
              Registered shops
            </small>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon orange">
            ☷
          </div>

          <div>

            <span>Product Requests</span>

            <h3>
              {dashboardLoading
                ? '...'
                : statistics.totalRequests}
            </h3>

            <small>
              Customer requests
            </small>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon purple">
            🛒
          </div>

          <div>

            <span>Total Orders</span>

            <h3>
              {dashboardLoading
                ? '...'
                : statistics.totalOrders}
            </h3>

            <small>
              Confirmed orders
            </small>

          </div>

        </div>

      </section>

      <section className="dashboard-grid">

        <div className="dashboard-card">

          <div className="card-header">

            <div>

              <h3>Recent Requests</h3>

              <p>
                Latest customer product requests
              </p>

            </div>

            <button
              onClick={() =>
                setActivePage('requests')
              }
            >
              View All →
            </button>

          </div>

          {recentRequests.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                ☷
              </div>

              <h4>No requests found</h4>

              <p>
                Customer requests will appear here.
              </p>

            </div>

          ) : (

            <div className="data-list">

              {recentRequests.map((request) => (

                <div
                  className="data-row"
                  key={request._id}
                >

                  <div className="data-icon">
                    ☷
                  </div>

                  <div className="data-info">

                    <strong>
                      {request.productName}
                    </strong>

                    <span>
                      {request.customerId?.name ||
                        'Customer'}
                    </span>

                  </div>

                  <div className="data-meta">

                    <strong>
                      ₹{request.budget}
                    </strong>

                    <span>
                      {formatDate(
                        request.createdAt
                      )}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        <div className="dashboard-card">

          <div className="card-header">

            <div>

              <h3>Recent Orders</h3>

              <p>
                Latest orders
              </p>

            </div>

            <button
              onClick={() =>
                setActivePage('orders')
              }
            >
              View All →
            </button>

          </div>

          {recentOrders.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                🛒
              </div>

              <h4>No orders found</h4>

              <p>
                Orders will appear here when
                customers accept offers.
              </p>

            </div>

          ) : (

            <div className="data-list">

              {recentOrders.map((order) => (

                <div
                  className="data-row"
                  key={order._id}
                >

                  <div className="data-icon">
                    🛒
                  </div>

                  <div className="data-info">

                    <strong>
                      {order.productName}
                    </strong>

                    <span>
                      {order.sellerId?.shopName ||
                        order.sellerId?.name ||
                        'Seller'}
                    </span>

                  </div>

                  <div className="data-meta">

                    <strong>
                      ₹{order.price}
                    </strong>

                    <span>
                      {formatDate(
                        order.createdAt
                      )}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>
    </>
  );

  const renderCustomers = () => (
    <>
      <header className="topbar">

        <div>

          <p className="breadcrumb">
            NearBuy / Customers
          </p>

          <h1>Customers</h1>

        </div>

        <div className="topbar-right">

          <button
            className="refresh-button"
            onClick={loadCustomers}
            disabled={customersLoading}
          >
            ↻
            {customersLoading
              ? 'Refreshing...'
              : 'Refresh'}
          </button>

          <div className="top-admin">

            <div className="avatar">
              {admin?.name
                ?.charAt(0)
                .toUpperCase() || 'A'}
            </div>

            <div>

              <strong>
                {admin?.name || 'Administrator'}
              </strong>

              <small>Admin</small>

            </div>

          </div>

        </div>

      </header>

      <section className="page-intro">

        <div>

          <h2>Customer Management</h2>

          <p>
            View and manage customers registered
            on the NearBuy platform.
          </p>

        </div>

        <div className="customer-count-card">

          <span>Total Customers</span>

          <strong>
            {customers.length}
          </strong>

        </div>

      </section>

      <section className="customer-panel">

        <div className="customer-toolbar">

          <div>

            <h3>All Customers</h3>

            <p>
              {filteredCustomers.length} customer
              {filteredCustomers.length !== 1
                ? 's'
                : ''} found
            </p>

          </div>

          <div className="customer-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search customers..."
              value={customerSearch}
              onChange={(e) =>
                setCustomerSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {customersError && (
          <div className="dashboard-error">
            {customersError}
          </div>
        )}

        {customersLoading ? (

          <div className="table-state">

            <div className="loading-spinner"></div>

            <h4>Loading customers...</h4>

            <p>
              Fetching customer information.
            </p>

          </div>

        ) : filteredCustomers.length === 0 ? (

          <div className="table-state">

            <div className="empty-table-icon">
              ♙
            </div>

            <h4>
              {customerSearch
                ? 'No customers found'
                : 'No customers yet'}
            </h4>

            <p>
              {customerSearch
                ? 'Try a different search term.'
                : 'Registered customers will appear here.'}
            </p>

          </div>

        ) : (

          <div className="customer-table-wrapper">

            <table className="customer-table">

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

                {filteredCustomers.map(
                  (customer) => (

                    <tr key={customer._id}>

                      <td>

                        <div className="customer-cell">

                          <div className="customer-avatar">
                            {getInitials(
                              customer.name
                            )}
                          </div>

                          <div>

                            <strong>
                              {customer.name ||
                                'Unnamed Customer'}
                            </strong>

                            <span>
                              Customer
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>

                        <span className="table-email">
                          {customer.email}
                        </span>

                      </td>

                      <td>
                        {customer.phone || 'N/A'}
                      </td>

                      <td>
                        {formatDate(
                          customer.createdAt
                        )}
                      </td>

                      <td>

                        <span className="status-badge active-status">
                          Active
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>
    </>
  );

  const renderSellers = () => (
    <>
      <header className="topbar">

        <div>

          <p className="breadcrumb">
            NearBuy / Sellers
          </p>

          <h1>Sellers</h1>

        </div>

        <div className="topbar-right">

          <button
            className="refresh-button"
            onClick={loadSellers}
            disabled={sellersLoading}
          >
            ↻
            {sellersLoading
              ? 'Refreshing...'
              : 'Refresh'}
          </button>

          <div className="top-admin">

            <div className="avatar">
              {admin?.name
                ?.charAt(0)
                .toUpperCase() || 'A'}
            </div>

            <div>

              <strong>
                {admin?.name || 'Administrator'}
              </strong>

              <small>Admin</small>

            </div>

          </div>

        </div>

      </header>

      <section className="page-intro">

        <div>

          <h2>Seller Management</h2>

          <p>
            View and manage sellers and shops
            registered on the NearBuy platform.
          </p>

        </div>

        <div className="customer-count-card">

          <span>Total Sellers</span>

          <strong>
            {sellers.length}
          </strong>

        </div>

      </section>

      <section className="customer-panel">

        <div className="customer-toolbar">

          <div>

            <h3>All Sellers</h3>

            <p>
              {filteredSellers.length} seller
              {filteredSellers.length !== 1
                ? 's'
                : ''} found
            </p>

          </div>

          <div className="customer-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search sellers or shops..."
              value={sellerSearch}
              onChange={(e) =>
                setSellerSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {sellersError && (
          <div className="dashboard-error">
            {sellersError}
          </div>
        )}

        {sellersLoading ? (

          <div className="table-state">

            <div className="loading-spinner"></div>

            <h4>Loading sellers...</h4>

            <p>
              Fetching seller information.
            </p>

          </div>

        ) : filteredSellers.length === 0 ? (

          <div className="table-state">

            <div className="empty-table-icon">
              ▣
            </div>

            <h4>
              {sellerSearch
                ? 'No sellers found'
                : 'No sellers yet'}
            </h4>

            <p>
              {sellerSearch
                ? 'Try a different search term.'
                : 'Registered sellers will appear here.'}
            </p>

          </div>

        ) : (

          <div className="customer-table-wrapper">

            <table className="customer-table">

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

                {filteredSellers.map(
                  (seller) => (

                    <tr key={seller._id}>

                      <td>

                        <div className="customer-cell">

                          <div className="customer-avatar">
                            {getInitials(
                              seller.name
                            )}
                          </div>

                          <div>

                            <strong>
                              {seller.name ||
                                'Unnamed Seller'}
                            </strong>

                            <span>
                              {seller.email ||
                                'Seller'}
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>

                        <strong>
                          {seller.shopName || 'N/A'}
                        </strong>

                      </td>

                      <td>
                        {seller.category || 'N/A'}
                      </td>

                      <td>

                        {seller.area
                          ? `${seller.area}, `
                          : ''}

                        {seller.city || 'N/A'}

                      </td>

                      <td>
                        {seller.phone || 'N/A'}
                      </td>

                      <td>
                        {formatDate(
                          seller.createdAt
                        )}
                      </td>

                      <td>

                        <span className="status-badge active-status">
                          Active
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>
    </>
  );

  return (
    <div className="admin-layout">

      <aside className="sidebar">

        <div className="sidebar-brand">

          <img
            src={nearbuyLogo}
            alt="NearBuy Logo"
            className="sidebar-logo"
          />

          <div>

            <h2>NearBuy</h2>

            <span>Admin Panel</span>

          </div>

        </div>

        <nav className="sidebar-nav">

          <p className="nav-title">
            MAIN MENU
          </p>

          <button
            className={`nav-item ${
              activePage === 'dashboard'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActivePage('dashboard')
            }
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className={`nav-item ${
              activePage === 'customers'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActivePage('customers')
            }
          >
            <span>♙</span>
            Customers
          </button>

          <button
            className={`nav-item ${
              activePage === 'sellers'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActivePage('sellers')
            }
          >
            <span>▣</span>
            Sellers
          </button>

          <button
            className={`nav-item ${
              activePage === 'requests'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActivePage('requests')
            }
          >
            <span>☷</span>
            Requests
          </button>

          <button
            className={`nav-item ${
              activePage === 'orders'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActivePage('orders')
            }
          >
            <span>🛒</span>
            Orders
          </button>

          <p className="nav-title second">
            SYSTEM
          </p>

          <button
            className={`nav-item ${
              activePage === 'settings'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActivePage('settings')
            }
          >
            <span>⚙</span>
            Settings
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="admin-mini-profile">

            <div className="avatar">
              {admin?.name
                ?.charAt(0)
                .toUpperCase() || 'A'}
            </div>

            <div className="admin-mini-info">

              <strong>
                {admin?.name ||
                  'Administrator'}
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >

            <span>↪</span>
            Logout

          </button>

        </div>

      </aside>

      <main className="main-content">

        {activePage === 'dashboard' &&
          renderDashboard()}

        {activePage === 'customers' &&
          renderCustomers()}

        {activePage === 'sellers' &&
          renderSellers()}

        {activePage !== 'dashboard' &&
          activePage !== 'customers' &&
          activePage !== 'sellers' && (

            <div className="coming-soon-page">

              <div className="coming-soon-icon">
                ✦
              </div>

              <h2>
                {activePage
                  .charAt(0)
                  .toUpperCase() +
                  activePage.slice(1)}
              </h2>

              <p>
                This section will be available
                in the next step.
              </p>

            </div>

          )}

      </main>

    </div>
  );
}

export default App;