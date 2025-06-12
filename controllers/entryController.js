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

// POST /entries
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

// GET /entries/search?name=xyz&from=yyyy-mm-dd&to=yyyy-mm-dd
export const searchEntries = async (req, res) => {
  try {
    const { name, from, to } = req.query;
    const query = {};

    if (name) query.customerName = new RegExp(name, 'i');
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const entries = await Entry.find(query).populate('createdBy', 'name number role');
    res.json(entries);
  } catch (err) {
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