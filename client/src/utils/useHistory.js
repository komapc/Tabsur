import { useNavigate, useLocation } from 'react-router-dom';

export default function useHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  return {
    push: (to, state) => {
      if (typeof to === 'string' && to.startsWith('#')) {
        navigate({ hash: to });
      } else if (typeof to === 'object') {
        navigate(to.pathname || to, { state: to.state });
      } else {
        navigate(to, state ? { state } : undefined);
      }
    },
    replace: (to) => navigate(to, { replace: true }),
    goBack: () => navigate(-1),
    go: (n) => navigate(n),
    get length() { return window.history.length; },
    location
  };
}
