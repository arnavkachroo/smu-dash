import Link from "next/link";

const Navbar = () => (
  <nav className="fixed top-0 w-full bg-white/30 backdrop-blur-md text-gray-800 shadow-md p-4">
    <div className="flex justify-center space-x-10 text-lg font-semibold">
      <Link href="/professordash" className="hover:text-blue-600">Home</Link>
      <Link href="/classes" className="hover:text-blue-600">Manage Classes</Link>
      <Link href="/schedule" className="hover:text-blue-600">Manage Students</Link>
      <Link href="/evaluations" className="hover:text-blue-600">Manage Groups</Link>
    </div>
  </nav>
);

export default Navbar;