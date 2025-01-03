
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import cartSlice from "./slices/cartSlices";
import authSlice from "./slices/authSlice";


const persistConfig = {
  key: "root",
  storage,
};


const rootReducer = combineReducers({
    auth: authSlice,
    cart:cartSlice
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
});


export const persistor = persistStore(store);
