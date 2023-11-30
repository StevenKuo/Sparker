import React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';
import { useAuth } from '../context';

function AuthRoute({ children, ...rest }) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (auth.token !== null) {
          return (
            children
          );
        }
        return (
          <Redirect to={{ pathname: '/signin', state: { from: location } }} />
        );
      }}
    />
  );
}

export default AuthRoute;
