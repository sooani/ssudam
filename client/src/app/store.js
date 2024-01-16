import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/userSlice';
import { persistStore, persistReducer } from "redux-persist"
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage: storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
    reducer: {
        user: persistedReducer,
    }
})

const persistor = persistStore(store);

export { store, persistor };