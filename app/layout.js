// app/layout.js
import React from 'react';
import { CssBaseline } from '@mui/material';  // Material UI 스타일 초기화
import { Roboto } from '@next/font/google';  // 폰트 설정

// Google 폰트 로드
const roboto = Roboto({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>COOPE</title>
      </head>
      <body className={roboto.className}>
        <CssBaseline />
        {/* 페이지마다 다른 콘텐츠는 children으로 전달 */}
        {children}
      </body>
    </html>
  );
}
