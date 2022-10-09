import { Router } from 'next/router';
import { staticAppRoutes } from '../../constants/config';
import { ACCESS_TOKEN_KEY } from '../../constants/storage';

type Props = {
  children: React.ReactNode;
  router: Router;
  requireGuest?: boolean;
};

const isBrowser = () => typeof window !== 'undefined';

export const RouteGuard: React.FC<Props> = ({
  children,
  router,
  requireGuest,
}) => {
  let unprotectedRoutes = [staticAppRoutes.login, staticAppRoutes.signup];
  let isProtectedRoute = unprotectedRoutes.indexOf(router.pathname) === -1;

  if (isBrowser()) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (accessToken) {
      if (requireGuest) {
        router.push(staticAppRoutes.dashboard);
      }
    } else {
      if (isProtectedRoute) {
        router.push(staticAppRoutes.login);
      }
    }
  }

  return <>{children}</>;
};
