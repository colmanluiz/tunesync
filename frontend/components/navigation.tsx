import Link from "next/link";

export function Navigation() {
  return (
    <nav>
      <div className="space-x-8 bg-gray-50 py-2.5 px-6 rounded-lg border-2 border-(--silver-50) drop-shadow-lg">
        <Link href="/" className="text-gray-500 hover:text-gray-700">
          Home
        </Link>
        <Link href="/features" className="text-gray-500 hover:text-gray-700">
          Features
        </Link>
        <Link href="/pricing" className="text-gray-500 hover:text-gray-700">
          Pricing
        </Link>
        <Link href="/about-us" className="text-gray-500 hover:text-gray-700">
          About Us
        </Link>
      </div>
    </nav>
  );
}
