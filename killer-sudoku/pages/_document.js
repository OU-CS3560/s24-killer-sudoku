/**
 * @file     _document.js
 * @author   Zachary Wolfe (zw224021@ohio.edu)
 * @brief    A file to display icons throughout the app, not just in one of the Routes
 * @date     March 10, 2024
 * @version  1.0
*/
import { Html, Head, Main, NextScript } from 'next/document'
 
/*
		NEXT JS REQUIRES A pages/_document.js TO SUPPRESS THIS WARNING
*/

// FOR ICONS, DONT TOUCH UNLESS ADDING MORE
// FOR ICONS, DONT TOUCH UNLESS ADDING MORE

export default function Document() {
  return (
    <Html>
      <Head>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=optional:wght@100" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}