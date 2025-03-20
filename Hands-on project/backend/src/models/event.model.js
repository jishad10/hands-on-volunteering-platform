import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema(
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
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    registrationDeadline: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamOrganizer: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    maxAttendees: {
      type: Number,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    volunteerLogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "VolunteerLog",
      },
    ],
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


// Auto-update event status based on the current date
EventSchema.pre("save", function (next) {
  const currentDate = new Date();
  if (this.date < currentDate) {
    this.status = "completed";
  } else if (this.date.toDateString() === currentDate.toDateString()) {
    this.status = "ongoing";
  } else {
    this.status = "upcoming";
  }
  next();
});

export const Event = mongoose.model("Event", EventSchema);