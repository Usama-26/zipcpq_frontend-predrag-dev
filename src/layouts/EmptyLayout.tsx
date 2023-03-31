import Head from 'next/head';
import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

export default function EmptyLayout({children}: LayoutProps) {
  return <>{children}</>;
}
