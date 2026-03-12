import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    unique: true
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'past_due', 'canceled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Tenant = mongoose.model('Tenant', tenantSchema);
export default Tenant;