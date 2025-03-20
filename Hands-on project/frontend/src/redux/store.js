import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import teamReducer from "./team/teamSlice"; 
import helpRequestReducer from "./help/helpRequestSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  user: userReducer,
  teams: teamReducer, 
  helpRequests: helpRequestReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["user"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
