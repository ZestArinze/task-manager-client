import Head from 'next/head';
import Image from 'next/image';
import React from 'react';

import { useRouter } from 'next/router';
import styles from './../../../styles/Default.module.css';

import { ACCESS_TOKEN_KEY } from '../../constants/storage';
import { staticAppRoutes } from '../../constants/config';

type Props = {
  title: string;
  children: React.ReactNode;
  showBottomNavigation?: boolean;
};

export const PageLayout: React.FC<Props> = ({
  title,
  children,
  showBottomNavigation,
}) => {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);

    router.push(staticAppRoutes.login);
  };

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>{title}</title>
          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main className={styles.main}>
          <div className='page-content '>
            {children}

            {showBottomNavigation && (
              <div className='my-5'>
                <a href='#' className='btn btn-danger' onClick={handleLogout}>
                  Logout
                </a>
              </div>
            )}
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image
                src='/vercel.svg'
                alt='Vercel Logo'
                width={72}
                height={16}
              />
            </span>
          </a>
        </footer>
      </div>
    </>
  );
};
