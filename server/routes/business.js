const express = require('express');
const router = express.Router();
const Business = require('../models/business');
const auth = require('../middleware/auth');

// Get business details
router.get('/:id', auth, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.json(business);
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
