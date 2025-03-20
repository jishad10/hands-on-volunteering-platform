import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeams: (state, action) => {
      state.list = action.payload;
    },
    addTeamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createTeamSuccess: (state, action) => {
      console.log("Team created successfully:", action.payload);
      state.list.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    createTeamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    joinTeamSuccess: (state, action) => {
      const updatedTeam = action.payload;
      state.list = state.list.map((team) =>
        team._id === updatedTeam._id ? updatedTeam : team
      );
    },
    leaveTeamSuccess: (state, action) => {
      const updatedTeam = action.payload;
      state.list = state.list.map((team) =>
        team._id === updatedTeam._id ? updatedTeam : team
      );
    },
  },
});

export const {
  setTeams,
  addTeamStart,
  createTeamSuccess,
  createTeamFailure,
  joinTeamSuccess,
  leaveTeamSuccess,
} = teamSlice.actions;

export default teamSlice.reducer;
