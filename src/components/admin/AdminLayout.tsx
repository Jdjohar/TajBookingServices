import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Car,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Routes', href: '/admin/routes', icon: MapPin },
    { name: 'Vehicles', href: '/admin/vehicles', icon: Car },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto bg-primary-700 transition duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Car className="h-8 w-8 text-white" />
            <span className="ml-2 font-heading text-lg font-bold text-white">Admin Panel</span>
          </div>
          <button
            onClick={closeSidebar}
            className="rounded-md p-2 text-white hover:bg-primary-600 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-5 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={closeSidebar}
              className={`${
                isActive(item.href)
                  ? 'bg-primary-800 text-white'
                  : 'text-primary-100 hover:bg-primary-600'
              } group mb-1 flex items-center rounded-md px-2 py-3 text-base font-medium`}
            >
              <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mb-1 flex w-full items-center rounded-md px-2 py-3 text-base font-medium text-primary-100 hover:bg-primary-600"
          >
            <LogOut className="mr-3 h-6 w-6 flex-shrink-0" />
            Logout
          </button>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-primary-700">
          <div className="flex h-16 flex-shrink-0 items-center px-4">
            <Car className="h-8 w-8 text-white" />
            <span className="ml-2 font-heading text-lg font-bold text-white">Admin Panel</span>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-primary-800 text-white'
                      : 'text-primary-100 hover:bg-primary-600'
                  } group mb-1 flex items-center rounded-md px-2 py-3 text-sm font-medium`}
                >
                  <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="mb-1 flex w-full items-center rounded-md px-2 py-3 text-sm font-medium text-primary-100 hover:bg-primary-600"
              >
                <LogOut className="mr-3 h-6 w-6 flex-shrink-0" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1"></div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center">
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="hidden md:block">
                      <div className="text-sm font-medium text-gray-700">{user?.name || 'Admin User'}</div>
                      <div className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;