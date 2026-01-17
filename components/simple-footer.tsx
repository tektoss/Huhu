import Link from "next/link"

export default function SimpleFooter() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col items-center gap-4">
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/about" className="text-gray-600 hover:text-black transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-black transition-colors">
              Contact
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-black transition-colors">
              FAQ
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-black transition-colors">
              Privacy Policy
            </Link>
          </nav>
          
          {/* Copyright */}
          <div className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Huhu. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
  