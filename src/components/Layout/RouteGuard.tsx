import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { ACCESS_TOKEN_KEY } from '../../constants/storage';

type Props = {
  children: React.ReactNode;
};

export const RouteGuard: React.FC<Props> = ({ children }) => {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  function handleAuthCheck(url: string) {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    console.log({ accessToken });

    if (accessToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      router.push('/');
    }
  }

  useEffect(() => {
    setCheckingAuth(true);

    // on initial load - run auth check
    handleAuthCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const updateLoggedIn = () => setIsLoggedIn(false);
    router.events.on('routeChangeStart', updateLoggedIn);

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', handleAuthCheck);

    setCheckingAuth(false);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', updateLoggedIn);
      router.events.off('routeChangeComplete', handleAuthCheck);
    };

    // reference: https://jasonwatmore.com/post/2021/08/30/next-js-redirect-to-login-page-if-unauthenticated

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <p>isLoggedIn: {isLoggedIn ? 'Yes' : 'No'}</p>

      {checkingAuth ? (
        <Spinner animation='border' variant='primary' />
      ) : (
        <> {children}</>
      )}
    </>
  );
};
