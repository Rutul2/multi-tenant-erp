import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true // Crucial for multi-tenant query performance
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Worker'],
    default: 'Worker'
  }
}, { timestamps: true });

// Compound index to ensure an email is only unique WITHIN a specific tenant
userSchema.index({ email: 1, tenantId: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
export default User;