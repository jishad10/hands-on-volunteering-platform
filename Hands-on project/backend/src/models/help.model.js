import mongoose, { Schema } from "mongoose";

const HelpRequestSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    urgencyLevel: {
      type: String,
      enum: ["low", "medium", "urgent"],
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    helpers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    resolved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        text: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);


export const Help = mongoose.model("HelpRequest", HelpRequestSchema);