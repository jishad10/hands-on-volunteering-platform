import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const helpRequestsSlice = createSlice({
  name: "helpRequests",
  initialState,
  reducers: {
    setHelpRequests: (state, action) => {
      state.list = action.payload;
    },
    addHelpRequestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createHelpRequestSuccess: (state, action) => {
      state.list.push(action.payload);
      state.loading = false;
    },
    createHelpRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateHelpRequestStatus: (state, action) => {
      const { id, status } = action.payload;
      const request = state.list.find((item) => item._id === id);
      if (request) request.status = status;
    },
    addHelperToRequest: (state, action) => {
      const { id, helper } = action.payload;
      const request = state.list.find((item) => item._id === id);
      if (request && !request.participants.some((p) => p._id === helper._id)) {
        request.participants.push(helper);
      }
    },
    removeHelperFromRequest: (state, action) => {
      const { id, helperId } = action.payload;
      const request = state.list.find((item) => item._id === id);
      if (request) {
        request.participants = request.participants.filter((p) => p._id !== helperId);
      }
    },
    addCommentToRequest: (state, action) => {
      const { id, comment } = action.payload;
      const request = state.list.find((item) => item._id === id);
      if (request) {
        request.comments.push(comment);
      }
    },
    updateHelpRequestParticipants: (state, action) => {
      const { id, participants } = action.payload;
      const request = state.list.find((item) => item._id === id);
      if (request) {
        request.participants = participants;
      }
    },
    updateHelpRequestData: (state, action) => {
      const updatedRequest = action.payload;
      const index = state.list.findIndex((item) => item._id === updatedRequest._id);
      if (index !== -1) {
        state.list[index] = updatedRequest;
      } else {
        state.list.push(updatedRequest);
      }
    },
  },
});

export const {
  setHelpRequests,
  addHelpRequestStart,
  createHelpRequestSuccess,
  createHelpRequestFailure,
  updateHelpRequestStatus,
  addHelperToRequest,
  removeHelperFromRequest,
  addCommentToRequest,
  updateHelpRequestParticipants,
  updateHelpRequestData,
} = helpRequestsSlice.actions;

export default helpRequestsSlice.reducer;
