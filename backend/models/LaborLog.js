import mongoose from "mongoose";

const laborLogSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  jobType: {
    type: String,
    required: true, // e.g., "Stitching", "Cutting", "Packaging"
  },
  quantityCompleted: {
    type: Number,
    required: true,
    min: 0
  },
  ratePerUnit: {
    type: Number,
    required: true
  },
  totalWages: {
    type: Number,
    required: true // quantityCompleted * ratePerUnit
  },
  status: {
    type: String,
    enum: ['Pending', 'Billed', 'Paid'],
    default: 'Pending'
  }
}, { timestamps: true });

const LaborLog = mongoose.model('LaborLog', laborLogSchema);
export default LaborLog;