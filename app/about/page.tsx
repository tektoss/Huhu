import NavBar from "@/components/nav-bar"
import SimpleFooter from "@/components/simple-footer"
import { Building2, Users, ShieldCheck, Globe } from "lucide-react"

export const metadata = {
  title: "About Us | Huhu",
  description: "Learn more about Huhu - Ghana's leading online marketplace for buying and selling.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <NavBar />

      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container px-4 mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold mb-4">About Huhu</h1>
          <p className="text-lg text-gray-300">
            Connecting buyers and sellers across Ghana since day one.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 bg-white">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              To empower Ghanaians by providing a trusted, easy-to-use platform 
              where anyone can buy, sell, and discover amazing products and services 
              in their local community.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <Building2 className="w-10 h-10 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Local Focus</h3>
                <p className="text-gray-600">
                  Built specifically for Ghana, we understand the local market and 
                  cater to the unique needs of Ghanaian buyers and sellers.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <Users className="w-10 h-10 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Community First</h3>
                <p className="text-gray-600">
                  We believe in building strong communities by connecting people 
                  and enabling local commerce to thrive.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <ShieldCheck className="w-10 h-10 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Trust & Safety</h3>
                <p className="text-gray-600">
                  Your safety is our priority. We implement measures to ensure 
                  secure transactions and protect our users.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <Globe className="w-10 h-10 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Accessibility</h3>
                <p className="text-gray-600">
                  We make buying and selling accessible to everyone, regardless 
                  of their technical expertise or location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-4">
              Huhu was born out of a simple idea: to create a platform where 
              Ghanaians can easily buy and sell anything, from everyday items to 
              properties and vehicles.
            </p>
            <p className="mb-4">
              We noticed that while global marketplaces existed, there was a need 
              for a solution tailored specifically to the Ghanaian market – one that 
              understands local payment methods, regional preferences, and the unique 
              way Ghanaians do business.
            </p>
            <p>
              Today, Huhu serves thousands of users across all regions of Ghana, 
              facilitating transactions and helping people find exactly what they're 
              looking for, right in their neighborhood.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-black text-white">
        <div className="container px-4 mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-6">
            Join thousands of Ghanaians already buying and selling on Huhu.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/signup"
              className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Account
            </a>
            <a
              href="/new-post"
              className="px-6 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
            >
              Post an Ad
            </a>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </main>
  )
}
