// import Entry from '../models/Entry.js';

// // POST /entries
// export const createEntry = async (req, res) => {
//   try {
//     const { type, fromProvider, toProvider, simProvider, rechargeAmount, price, number, customerName } = req.body;

//     const newEntry = await Entry.create({
//       type,
//       fromProvider,
//       toProvider,
//       simProvider,
//       rechargeAmount,
//       price,
//       number,
//       customerName,
//       createdBy: req.user.id
//     });

//     res.status(201).json(newEntry);
//   } catch (err) {
//     console.error('Entry creation failed:', err);
//     res.status(500).json({ message: 'Entry creation failed' });
//   }
// };

// // GET /entries/mine
// export const getMyEntries = async (req, res) => {
//   try {
//     const entries = await Entry.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
//     res.json(entries);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch entries' });
//   }
// };

// // GET /entries/search?name=xyz&from=yyyy-mm-dd&to=yyyy-mm-dd
// export const searchEntries = async (req, res) => {
//   try {
//     const { name, from, to } = req.query;
//     const query = {};

//     if (name) query.customerName = new RegExp(name, 'i');
//     if (from || to) {
//       query.createdAt = {};
//       if (from) query.createdAt.$gte = new Date(from);
//       if (to) query.createdAt.$lte = new Date(to);
//     }

//     const entries = await Entry.find(query).populate('createdBy', 'name number role');
//     res.json(entries);
//   } catch (err) {
//     res.status(500).json({ message: 'Search failed' });
//   }
// };

// // GET /entries/byUser/:id
// export const getEntriesByUser = async (req, res) => {
//   try {
//     const entries = await Entry.find({ createdBy: req.params.id }).sort({ createdAt: -1 });
//     res.json(entries);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch user entries' });
//   }
// };


// //Get All Entries /entries/
// export const getAllEntries = async (req, res) => {
//   try {
//     const entries = await Entry.find().sort({ createdAt: -1 });
//     res.json(entries);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch entries' });
//   }
// };

import Entry from '../models/Entry.js';
import User from '../models/User.js';
import axios from 'axios'; // <--- Make sure axios is installed

// Helper function to send notification
const sendPushNotification = async (expoPushToken, title, body) => {
  try {
    await axios.post('https://exp.host/--/api/v2/push/send', {
      to: expoPushToken,
      sound: 'default',
      title,
      body
    });
  } catch (error) {
    console.error('Notification Error:', error.message);
  }
};
// POST /entries
// export const createEntry = async (req, res) => {
//   try {
//     const { type, fromProvider, toProvider, simProvider, rechargeAmount, price, number, customerName } = req.body;

//     const newEntry = await Entry.create({
//       type,
//       fromProvider,
//       toProvider,
//       simProvider,
//       rechargeAmount,
//       price,
//       number,
//       customerName,
//       createdBy: req.user.id
//     });

//     res.status(201).json(newEntry);
//   } catch (err) {
//     console.error('Entry creation failed:', err);
//     res.status(500).json({ message: 'Entry creation failed' });
//   }
// };

export const createEntry = async (req, res) => {
  try {
    const { type, fromProvider, toProvider, simProvider, rechargeAmount, price, number, customerName } = req.body;

    const newEntry = await Entry.create({
      type,
      fromProvider,
      toProvider,
      simProvider,
      rechargeAmount,
      price,
      number,
      customerName,
      createdBy: req.user.id
    });

    // Notify Admin
    const admin = await User.findOne({ role: 'admin', pushToken: { $ne: null } });
    if (admin?.pushToken) {
      await sendPushNotification(
        admin.pushToken,
        '📲 New SIM Entry',
        `A new ${type} entry was created for ${customerName}`
      );
    }

    res.status(201).json(newEntry);
  } catch (err) {
    console.error('Entry creation failed:', err);
    res.status(500).json({ message: 'Entry creation failed' });
  }
};

// GET /entries/mine
export const getMyEntries = async (req, res) => {
  try {
    const entries = await Entry.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch entries' });
  }
};

// // GET /entries/search?name=xyz&from=yyyy-mm-dd&to=yyyy-mm-dd
// export const searchEntries = async (req, res) => {
//   try {
//     const { name, from, to } = req.query;
//     const query = {};

//     if (name) query.customerName = new RegExp(name, 'i');
//     if (from || to) {
//       query.createdAt = {};
//       if (from) query.createdAt.$gte = new Date(from);
//       if (to) query.createdAt.$lte = new Date(to);
//     }

//     const entries = await Entry.find(query).populate('createdBy', 'name number role');
//     res.json(entries);
//   } catch (err) {
//     res.status(500).json({ message: 'Search failed' });
//   }
// };

// GET /entries/search?name=xyz&from=yyyy-mm-dd&to=yyyy-mm-dd
export const searchEntries = async (req, res) => {
  try {
    const { name, from, to } = req.query;
    const query = {};

    // Search by customerName or number (partial, case-insensitive)
    if (name) {
      const regex = new RegExp(name, 'i'); // case-insensitive
      query.$or = [
        { customerName: regex },
        { number: regex }
      ];
    }

    // Date filter (createdAt range)
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const entries = await Entry.find(query).populate('createdBy', 'name number role');
    res.json(entries);
  } catch (err) {
    console.error('Search failed:', err);
    res.status(500).json({ message: 'Search failed' });
  }
};


// GET /entries/byUser/:id
export const getEntriesByUser = async (req, res) => {
  try {
    const entries = await Entry.find({ createdBy: req.params.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user entries' });
  }
};

// GET /entries/all
export const getAllEntries = async (req, res) => {
  try {
    const entries = await Entry.find().populate('createdBy', 'name number role').sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch entries' });
  }
};

// GET /entries/:id - Missing route for entry details
export const getEntryById = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id).populate('createdBy', 'name number role');
    
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch entry details' });
  }
};