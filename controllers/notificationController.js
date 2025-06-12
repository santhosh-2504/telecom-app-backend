// controllers/notificationController.js
import Notification from '../models/Notification.js';
import Entry from '../models/Entry.js';

export const createNotification = async (req, res) => {
  const { entryId, message } = req.body;

  try {
    const notification = await Notification.create({
      entryId,
      message,
      createdBy: req.user.id
    });

    res.status(201).json(notification);
  } catch (err) {
    console.error('Notification error:', err);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

export const getNotificationsForAdmin = async (req, res) => {
  try {
    if (req.user.userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admin can access notifications' });
    }

    const notifications = await Notification.find()
      .populate('createdBy', 'name')
      .populate('entryId')
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    console.error('Fetch notifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};
