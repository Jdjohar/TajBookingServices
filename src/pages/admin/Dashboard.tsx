e-500">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">98</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-success-500">
              <ArrowUp size={16} className="mr-1" />
              5.3%
            </span>
            <span className="ml-2 text-gray-600">from last month</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings and Top Routes */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <Link
              to="/admin/bookings"
              className="flex items-center text-sm font-medium text-primary-500 hover:text-primary-600"
            >
              View all
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Route
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {displayStats.recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{booking.customer.name}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {booking.route.pickupLocation.name} to {booking.route.dropoffLocation.name}
                      </div>
                      <div className="text-xs text-gray-500">{booking.vehicle.name}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="text-sm text-gray-900">{booking.pickupDate}</div>
                      <div className="text-xs text-gray-500">{booking.pickupTime}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">${booking.totalPrice}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${
                          booking.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : booking.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Top Routes</h2>
            <Link
              to="/admin/routes"
              className="flex items-center text-sm font-medium text-primary-500 hover:text-primary-600"
            >
              Manage
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {displayStats.topRoutes.map((route, index) => (
              <div key={route._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{route.route}</p>
                    <p className="text-xs text-gray-500">{route.count} bookings</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">#{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Monthly Revenue and Vehicle Utilization */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Monthly Revenue</h2>
          <div className="h-64">
            <div className="flex h-full items-end">
              {displayStats.monthlyRevenue.map((item, index) => (
                <div key={index} className="flex flex-1 flex-col items-center">
                  <div
                    className="w-full bg-primary-500"
                    style={{
                      height: `${(item.revenue / Math.max(...displayStats.monthlyRevenue.map((i) => i.revenue))) * 200}px`,
                    }}
                  ></div>
                  <div className="mt-2 text-xs font-medium text-gray-600">{item.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Vehicle Utilization</h2>
            <Link
              to="/admin/vehicles"
              className="flex items-center text-sm font-medium text-primary-500 hover:text-primary-600"
            >
              View all
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center">
                <Car className="mr-2 text-primary-500" size={20} />
                <h3 className="font-medium text-gray-900">Premium Sedan</h3>
              </div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-600">Usage Rate</span>
                <span className="font-medium text-gray-900">78%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-[78%] rounded-full bg-primary-500"></div>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center">
                <Car className="mr-2 text-primary-500" size={20} />
                <h3 className="font-medium text-gray-900">SUV</h3>
              </div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-600">Usage Rate</span>
                <span className="font-medium text-gray-900">65%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-[65%] rounded-full bg-primary-500"></div>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center">
                <Car className="mr-2 text-primary-500" size={20} />
                <h3 className="font-medium text-gray-900">Luxury Van</h3>
              </div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-600">Usage Rate</span>
                <span className="font-medium text-gray-900">42%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-[42%] rounded-full bg-primary-500"></div>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center">
                <Car className="mr-2 text-primary-500" size={20} />
                <h3 className="font-medium text-gray-900">Executive Sedan</h3>
              </div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-600">Usage Rate</span>
                <span className="font-medium text-gray-900">51%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-[51%] rounded-full bg-primary-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;