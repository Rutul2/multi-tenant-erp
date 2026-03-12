import LaborLog from '../models/LaborLog.js';

// @desc    Create a new labor entry
// @route   POST /api/labor
export const createLaborLog = async (req, res) => {
  try {
    const { workerId, jobType, quantityCompleted, ratePerUnit } = req.body;

    const totalWages = quantityCompleted * ratePerUnit;

    const laborLog = await LaborLog.create({
      tenantId: req.user.tenantId, // Automatically injected by your auth middleware
      workerId,
      jobType,
      quantityCompleted,
      ratePerUnit,
      totalWages
    });

    res.status(201).json(laborLog);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating labor log', error: error.message });
  }
};

// @desc    Get all labor logs for the logged-in business
// @route   GET /api/labor
export const getLaborLogs = async (req, res) => {
  try {
    // Crucial: Only fetch logs that belong to this specific tenant
    const logs = await LaborLog.find({ tenantId: req.user.tenantId })
                               .populate('workerId', 'fullName email'); // Gets worker details

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching labor logs', error: error.message });
  }
};  