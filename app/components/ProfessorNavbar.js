"use client";

import Image from "next/image";
import Link from "next/link";

const Navbar = () => (
  <nav className="fixed top-0 w-full bg-white/30 backdrop-blur-md text-gray-800 shadow-md p-3 z-50">
    <div className="relative flex items-center justify-center max-w-7xl mx-auto">
      {/* Left: Logo (absolute positioned) */}
      <div className="absolute left-0">
        <Link href="/">
          <Image src="/smu.png" alt="SMU Logo" width={100} height={100} className="cursor-pointer" />
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex space-x-6 text-base font-medium">
        <Link href="/professordash" className="hover:text-blue-600">Home</Link>
        <Link href="/manageclasses" className="hover:text-blue-600">Manage Classes</Link>
        <Link href="/managestudents" className="hover:text-blue-600">Manage Students</Link>
        <Link href="/managegroups" className="hover:text-blue-600">Manage Groups</Link>
        <Link href="/createEvaluation" className="hover:text-blue-600">Manage Evaluations</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
