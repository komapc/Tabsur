import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

export default function withRouter(Component) {
  function ComponentWithRouter(props) {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const history = {
      push: (path, state) => {
        if (typeof path === 'object') {
          navigate(path.pathname || path, { state: path.state });
        } else {
          navigate(path, state ? { state } : undefined);
        }
      },
      replace: (path, state) => navigate(path, { replace: true, state }),
      goBack: () => navigate(-1),
      go: (n) => navigate(n),
      get length() { return window.history.length; }
    };
    const match = { params, path: location.pathname };
    return <Component {...props} history={history} match={match} location={location} />;
  }
  ComponentWithRouter.displayName = `withRouter(${Component.displayName || Component.name})`;
  return ComponentWithRouter;
}
