import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["event", "help_request", "team_invite", "achievement", "general"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model("Notification", NotificationSchema);
