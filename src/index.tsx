import React from 'react';
import {Provider} from "react-redux";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from "./redux/store";

const root: ReactDOM.Root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);
