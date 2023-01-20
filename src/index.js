import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store';
import { PersistGate } from "redux-persist/es/integration/react";
import ScanQRcode from './component/ScanQRcode/ScanQRcode';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.Fragment>
       <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* <ScanQRcode/> */}
        <App />
        </PersistGate>
      </Provider>
  </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
