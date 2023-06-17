import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();
  // response.headers.set(
  //   'Content-Security-Policy',
  //   'script-src \'self\'; img-src \'self\' secure.gravatar.com; style-src \'self\'; connect-src \'self\'',
  // );
  return response;
}

export const config = {
  matcher: ['/:path*'],
};
