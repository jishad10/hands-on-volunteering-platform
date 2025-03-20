import mongoose, { Schema } from "mongoose";

const VolunteerLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    hours: {
      type: Number,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    requiresVerification: {
      type: Boolean,
      default: true,  
    },
    peerVerifications: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true }
);

export const VolunteerLog = mongoose.model("VolunteerLog", VolunteerLogSchema);
