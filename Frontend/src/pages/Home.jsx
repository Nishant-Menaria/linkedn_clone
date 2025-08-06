import React from 'react';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <Feed />
    </div>
  );
}
