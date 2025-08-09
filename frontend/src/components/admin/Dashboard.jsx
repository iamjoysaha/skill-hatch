import React from "react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [users, setUsers] = React.useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ]);
  
  const [products, setProducts] = React.useState([
    { id: 1, name: "Product A", price: 29.99 },
    { id: 2, name: "Product B", price: 49.99 },
  ]);

  const [orders, setOrders] = React.useState([
    { id: 1, customer: "John Doe", total: 59.98, status: "Pending" },
    { id: 2, customer: "Jane Smith", total: 99.99, status: "Shipped" },
  ]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const addProduct = () => {
    const newProduct = {
      id: products.length + 1,
      name: `Product ${products.length + 1}`,
      price: 19.99,
    };
    setProducts([...products, newProduct]);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`sidebar bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 md:static md:translate-x-0 ${
          !sidebarOpen && "sidebar-hidden"
        }`}
      >
        <h2 className="text-2xl font-semibold text-center">Admin Dashboard</h2>
        <nav>
          <a
            href="#dashboard"
            className="block py-2.5 px-4 rounded hover:bg-gray-700"
          >
            Dashboard
          </a>
          <a
            href="#users"
            className="block py-2.5 px-4 rounded hover:bg-gray-700"
          >
            Users
          </a>
          <a
            href="#products"
            className="block py-2.5 px-4 rounded hover:bg-gray-700"
          >
            Products
          </a>
          <a
            href="#orders"
            className="block py-2.5 px-4 rounded hover:bg-gray-700"
          >
            Orders
          </a>
          <a
            href="#settings"
            className="block py-2.5 px-4 rounded hover:bg-gray-700"
          >
            Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <button
            className="md:hidden focus:outline-none"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, Admin</span>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Overview */}
          <section id="dashboard" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium">Total Users</h3>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium">Total Products</h3>
                <p className="text-3xl font-bold">{products.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium">Total Orders</h3>
                <p className="text-3xl font-bold">{orders.length}</p>
              </div>
            </div>
          </section>

          {/* Users Management */}
          <section id="users" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="p-2">{user.id}</td>
                      <td className="p-2">{user.name}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">
                        <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                          Edit
                        </button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Products Management */}
          <section id="products" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <button
                onClick={addProduct}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
              >
                Add Product
              </button>
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="p-2">{product.id}</td>
                      <td className="p-2">{product.name}</td>
                      <td className="p-2">${product.price}</td>
                      <td className="p-2">
                        <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                          Edit
                        </button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Orders Management */}
          <section id="orders">
            <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Order ID</th>
                    <th className="p-2">Customer</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="p-2">{order.id}</td>
                      <td className="p-2">{order.customer}</td>
                      <td className="p-2">${order.total}</td>
                      <td className="p-2">{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
