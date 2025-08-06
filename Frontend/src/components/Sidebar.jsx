import React from "react";
export default function Sidebar() {
    return (
      <div className="w-1/5 bg-white p-4 shadow-md hidden md:block">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <ul className="space-y-2">
          <li className="text-blue-600 cursor-pointer">My Network</li>
          <li className="text-blue-600 cursor-pointer">Jobs</li>
          <li className="text-blue-600 cursor-pointer">Messaging</li>
          <li className="text-blue-600 cursor-pointer">Notifications</li>
        </ul>
      </div>
    );
  }
  