import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import Route from '../models/Route.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [totalBookings, pendingBookings, completedBookings, totalRevenue] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
    ]);

    res.status(200).json({
      totalBookings,
      pendingBookings,
      completedBookings,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};

// Get revenue statistics
export const getRevenue = async (req, res) => {
  try {
    const revenue = await Booking.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.status(200).json(revenue);
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({ message: 'Error fetching revenue statistics' });
  }
};

// Get top routes
export const getTopRoutes = async (req, res) => {
  try {
    const topRoutes = await Booking.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$route',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'routes',
          localField: '_id',
          foreignField: '_id',
          as: 'routeDetails'
        }
      }
    ]);

    res.status(200).json(topRoutes);
  } catch (error) {
    console.error('Get top routes error:', error);
    res.status(500).json({ message: 'Error fetching top routes' });
  }
};

// Get vehicle utilization
export const getVehicleUtilization = async (req, res) => {
  try {
    const utilization = await Booking.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$vehicle',
          totalBookings: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'vehicles',
          localField: '_id',
          foreignField: '_id',
          as: 'vehicleDetails'
        }
      }
    ]);

    res.status(200).json(utilization);
  } catch (error) {
    console.error('Get vehicle utilization error:', error);
    res.status(500).json({ message: 'Error fetching vehicle utilization' });
  }
};

// Get customer statistics
export const getCustomerStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$customer.email',
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' }
        }
      },
      { $sort: { totalBookings: -1 } }
    ]);

    res.status(200).json(stats);
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({ message: 'Error fetching customer statistics' });
  }
};