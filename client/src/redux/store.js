import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import onlineReducer from "./user/onlineSlice";
import bookingReducer from "./booking/bookingSlice";
import favoriteReducer from "./favorite/favoriteSlice";
import providerReducer from "./provider/providerSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  user: userReducer,
  booking: bookingReducer,
  favorite: favoriteReducer,
  provider: providerReducer,
  online: onlineReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
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
