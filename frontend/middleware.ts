import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {

  const { pathname } = req.nextUrl;
  const token = req.cookies.get('refreshToken');
  
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/fonts') || 
    pathname.includes('.')         
  ) {
    return NextResponse.next();
  }
  
  if(token) {

      if( pathname === '/login' || pathname === '/register') {
        
        return NextResponse.redirect(new URL('/', req.url));
      }

    return NextResponse.next();
  }

  if( pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/login', req.url));

}

export const config = {
  matcher: ['/:path*'],
};


