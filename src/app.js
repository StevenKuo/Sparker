import React from 'react';
import './trans';
import {
  Switch,
  Route,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Home from './pages/home';
import './App.scss';
import ProvideAuth from './auth/context';
import AuthRoute from './auth/route';
import store from './store';

function App() {
  return (
    <div>
      <Provider store={store}>
        <ProvideAuth>
          <Switch>
            <Route path="/signin" component={Signin} />
            <Route path="/signup" component={Signup} />
            <AuthRoute path="/">
              <Home />
            </AuthRoute>
          </Switch>
        </ProvideAuth>
      </Provider>
    </div>
  );
}

export default App;
