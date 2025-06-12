// controllers/analyticsController.js
import Entry from '../models/Entry.js';
import mongoose from 'mongoose';

export const getDashboardStats = async (req, res) => {
  try {
    if (req.user.userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admin can access analytics' });
    }

    const matchStage = {}; // Could later add date filters

    const [totals, profit, byType, byWorker] = await Promise.all([
      Entry.countDocuments(matchStage),

      Entry.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalProfit: {
              $sum: {
                $cond: [{ $gt: ['$price', 0] }, '$price', 0]
              }
            }
          }
        }
      ]),

      Entry.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]),

      Entry.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$createdBy',
            count: { $sum: 1 }
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
            _id: 0,
            name: '$user.name',
            entries: '$count'
          }
        }
      ])
    ]);

    res.status(200).json({
      totalEntries: totals,
      totalProfit: profit[0]?.totalProfit || 0,
      entriesByType: byType,
      entriesByWorker: byWorker
    });

  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
