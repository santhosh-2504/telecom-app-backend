import Entry from '../models/Entry.js';
import User from '../models/User.js';

// Get comprehensive analytics data
export const getAnalytics = async (req, res) => {
  try {
    const { timeRange = '30' } = req.query; // days
    const daysBack = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Total entries count
    const totalEntries = await Entry.countDocuments();
    
    // Entries in time range
    const entriesInRange = await Entry.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Entry type breakdown
    const entryTypeStats = await Entry.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Provider analysis (for MNP entries)
    const providerStats = await Entry.aggregate([
      { $match: { type: 'MNP' } },
      {
        $group: {
          _id: {
            from: '$fromProvider',
            to: '$toProvider'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Top performing workers
    const workerStats = await Entry.aggregate([
      {
        $group: {
          _id: '$createdBy',
          totalEntries: { $sum: 1 },
          recentEntries: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', startDate] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          name: '$user.name',
          number: '$user.number',
          totalEntries: 1,
          recentEntries: 1
        }
      },
      { $sort: { totalEntries: -1 } },
      { $limit: 10 }
    ]);

    // Daily entry trends (last 30 days)
    const dailyTrends = await Entry.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 },
          mnpCount: {
            $sum: { $cond: [{ $eq: ['$type', 'MNP'] }, 1, 0] }
          },
          newSimCount: {
            $sum: { $cond: [{ $eq: ['$type', 'New Sim'] }, 1, 0] }
          },
          replacementCount: {
            $sum: { $cond: [{ $eq: ['$type', 'Replacement'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Revenue analysis (approximate)
    const revenueStats = await Entry.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $addFields: {
          numericPrice: {
            $cond: [
              { $eq: ['$price', 'Free'] },
              0,
              { $toDouble: '$price' }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$numericPrice' },
          avgRevenue: { $avg: '$numericPrice' },
          freeEntries: {
            $sum: { $cond: [{ $eq: ['$price', 'Free'] }, 1, 0] }
          },
          paidEntries: {
            $sum: { $cond: [{ $ne: ['$price', 'Free'] }, 1, 0] }
          }
        }
      }
    ]);

    // Monthly comparison
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const lastMonth = new Date(currentMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const currentMonthEntries = await Entry.countDocuments({
      createdAt: { $gte: currentMonth }
    });

    const lastMonthEntries = await Entry.countDocuments({
      createdAt: { $gte: lastMonth, $lt: currentMonth }
    });

    // Peak hours analysis
    const peakHours = await Entry.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Recent entries
    const recentEntries = await Entry.find()
      .populate('createdBy', 'name number')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('type customerName number price createdAt');

    const analytics = {
      summary: {
        totalEntries,
        entriesInRange,
        currentMonthEntries,
        lastMonthEntries,
        monthlyGrowth: lastMonthEntries > 0 
          ? ((currentMonthEntries - lastMonthEntries) / lastMonthEntries * 100).toFixed(1)
          : 0
      },
      entryTypes: entryTypeStats,
      providerStats,
      workerStats,
      dailyTrends,
      revenue: revenueStats[0] || {
        totalRevenue: 0,
        avgRevenue: 0,
        freeEntries: 0,
        paidEntries: 0
      },
      peakHours: peakHours.slice(0, 5),
      recentEntries,
      timeRange: daysBack
    };

    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

// Get worker-specific analytics
export const getWorkerAnalytics = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { timeRange = '30' } = req.query;
    const daysBack = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Worker's entries
    const totalEntries = await Entry.countDocuments({ createdBy: workerId });
    const recentEntries = await Entry.countDocuments({
      createdBy: workerId,
      createdAt: { $gte: startDate }
    });

    // Entry type breakdown for this worker
    const entryTypes = await Entry.aggregate([
      { $match: { createdBy: workerId } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Daily performance for this worker
    const dailyPerformance = await Entry.aggregate([
      {
        $match: {
          createdBy: workerId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Worker info
    const worker = await User.findById(workerId).select('name number');

    res.json({
      worker,
      summary: {
        totalEntries,
        recentEntries
      },
      entryTypes,
      dailyPerformance,
      timeRange: daysBack
    });
  } catch (error) {
    console.error('Worker analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch worker analytics' });
  }
};