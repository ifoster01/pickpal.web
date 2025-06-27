import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import './globals.css';
import Script from 'next/script';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Pickpockt',
  description: 'Enrich your sports betting.',
};

const RootLayout = (props: PropsWithChildren) => {
  const { children } = props;
  return (
    <html lang='en'>
      <head>
        <Script id='microsoft-clarity' strategy='afterInteractive'>
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "qbepns771d");
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
