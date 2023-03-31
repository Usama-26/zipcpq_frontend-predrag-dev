import {IncomingMessage} from 'http';
import type {NextFetchEvent, NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {setLicenseDB} from 'server/db';
// In rewrite method you pass a page folder name(as a string). which // you create to handle underConstraction  functionalty.

export async function middleware(request: NextRequest) {}
// See "Matching Paths" below to learn more
export const config = {
  // matcher: ['/api/:path*'],
};
