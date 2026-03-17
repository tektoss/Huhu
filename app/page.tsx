"use client"

import { useRef } from "react"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import NavBar from "@/components/nav-bar"
import { Smartphone, Car, Shirt, HomeIcon, Sofa, Dumbbell, Gamepad2, BookOpen, Briefcase, Wrench, ArrowRight } from "lucide-react"
import SoapDispenser from '@/components/icons/soap-dispenser-droplet.svg';
import { useProducts } from "@/hooks/use-products"

export default function Home() {
  const featuredRef = useRef<HTMLDivElement>(null)
  const { products, loading } = useProducts();

  // Handle scroll to featured products
  const scrollToFeatured = () => {
    featuredRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Handle scroll to top button visibility
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 300) {
  //       setShowScrollTop(true)
  //     } else {
  //       setShowScrollTop(false)
  //     }
  //   }

  //   window.addEventListener("scroll", handleScroll)
  //   return () => window.removeEventListener("scroll", handleScroll)
  // }, [])

  // Handle scroll to top
  // const scrollToTop = () => {
  //   window.scrollTo({ top: 0, behavior: "smooth" })
  // }

  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <NavBar />

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[430px] overflow-hidden"
        style={{ backgroundImage: "url('/pattern_bg.jpg')" }}
      >
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-secondary/60" />
        <div className="relative container flex flex-col items-center justify-center h-full px-4 mx-auto text-center">
          <span className="mb-3 px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full bg-secondary text-primary">
            Ghana&apos;s #1 Marketplace
          </span>
          <h1 className="mb-3 text-4xl font-extrabold text-white md:text-5xl drop-shadow-md">
            Discover Ghana&apos;s Marketplace
          </h1>
          <p className="mb-6 text-base text-white/80 max-w-md">
            Buy &amp; sell cars, phones, fashion, properties, jobs and services — all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={scrollToFeatured}
              className="px-6 py-3 font-semibold text-primary bg-secondary rounded-md hover:bg-secondary-light transition-colors"
            >
              Shop Now
            </button>
            <Link href="/jobs" className="px-6 py-3 font-semibold text-white border-2 border-white rounded-md hover:bg-white/10 transition-colors">
              Find Jobs
            </Link>
            <Link href="/services" className="px-6 py-3 font-semibold text-white border-2 border-white rounded-md hover:bg-white/10 transition-colors">
              Hire Services
            </Link>
            <Link href="/properties" className="px-6 py-3 font-semibold text-white border-2 border-white rounded-md hover:bg-white/10 transition-colors">
              Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Cards */}
      <section className="py-10 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Jobs */}
            <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-white shadow-md">
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
              <Briefcase className="w-8 h-8 mb-3 text-secondary" />
              <h2 className="mb-2 text-xl font-bold">Find Jobs</h2>
              <p className="mb-5 text-sm text-white/75">Explore hundreds of job opportunities across Ghana today.</p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1 px-5 py-2 font-semibold text-primary bg-secondary rounded-md hover:bg-secondary-light transition-colors text-sm"
              >
                View Jobs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* New Products */}
            <div className="relative overflow-hidden rounded-xl bg-secondary p-6 text-primary shadow-md">
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-primary/10" />
              <Smartphone className="w-8 h-8 mb-3 text-primary" />
              <h2 className="mb-2 text-xl font-bold">New Arrivals</h2>
              <p className="mb-5 text-sm text-primary/70">Be the first to discover the freshest listings on Huhu.</p>
              <Link
                href="/category/new"
                className="inline-flex items-center gap-1 px-5 py-2 font-semibold text-white bg-primary rounded-md hover:bg-primary-light transition-colors text-sm"
              >
                Browse New <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Services */}
            <div className="relative overflow-hidden rounded-xl bg-primary-alt border border-primary/20 p-6 text-primary shadow-md">
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-primary/10" />
              <Wrench className="w-8 h-8 mb-3 text-primary" />
              <h2 className="mb-2 text-xl font-bold">Hire Services</h2>
              <p className="mb-5 text-sm text-primary/70">Connect with skilled service providers across Ghana.</p>
              <Link
                href="/services"
                className="inline-flex items-center gap-1 px-5 py-2 font-semibold text-white bg-primary rounded-md hover:bg-primary-light transition-colors text-sm"
              >
                Browse Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>



       {/* Brands Carousel */}
       {/* <section className="mb-[60px]" >
         <h2 className="px-4 mb-6 text-2xl font-bold">Top Brands</h2>
        <div className={`slider w-full bg-black`} onMouseOver={() => setMouseOver(true)} onMouseOut={() => setMouseOver(false)}>
          <div className={`${mouseOver ? "lg:slide-track-pause slide-track-pause-sm" : "lg:slide-track slide-track-sm"} md:slide-track`}>
            <button className="slide" onClick={() => route.push("/category/nike")}>
              <img src="/icons8-nike.svg" className="h-[80%] lg:h-full hover:opacity-50" alt="nike" title="nike" />
            </button>
            <button className="slide" onClick={() => route.push("/category/nike")}>
              <img src="/icons8-nike.svg" className="h-[80%] lg:h-full hover:opacity-50" alt="nike" title="nike" />
            </button>
            <button className="slide" onClick={() => route.push("/category/adidas")}>
              <img src="https://seeklogo.com/images/A/adidas-logo-344EED0709-seeklogo.com.png" className="h-[70%] lg:h-full hover:opacity-50" alt="adidas" title="adidas" />
            </button>
            <button className="slide" onClick={() => route.push("/category/apple")}>
              <img src="https://cdn.iconscout.com/icon/free/png-256/free-apple-icon-download-in-svg-png-gif-file-formats--social-icons-color-pack-logos-432495.png?f=webp" className="h-[60%] lg:h-[80%] hover:opacity-50" alt="apple" title="apple" />
            </button>
            <button className="slide" onClick={() => route.push("/category/samsung")}>
              <img src="https://cdn.iconscout.com/icon/free/png-256/free-samsung-logo-icon-download-in-svg-png-gif-file-formats--brand-mobile-logos-pack-icons-226432.png?f=webp" className="w-[100px] lg:w-[130px] hover:opacity-50" alt="samsung" title="samsung" />
            </button>
            <button className="slide" onClick={() => route.push("/category/nike")}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/640px-Microsoft_logo.svg.png" className="h-[65%] hover:opacity-50" alt="" />
            </button>
            <button className="slide" onClick={() => route.push("/category/nike")}>
              <img src="https://images.seeklogo.com/logo-png/3/2/dell-logo-png_seeklogo-39672.png" className="h-full hover:opacity-50" alt="" />
            </button>
            <button className="slide" onClick={() => route.push("/category/nike")}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6f/HP_logo_630x630.png" className="h-full hover:opacity-50" alt="" />
            </button>
            <button className="slide" onClick={() => route.push("/category/nike")}>
              <img src="https://images.seeklogo.com/logo-png/9/2/nintendo-logo-png_seeklogo-99658.png" className="w-[120px] hover:opacity-50" alt="" />
            </button>
            <button className="slide" onClick={() => route.push("/category/nike")}>
              <img src="https://pngimg.com/d/sony_playstation_PNG17532.png" className="h-[70%] hover:opacity-50" alt="" />
            </button>
            <button className="slide" onClick={() => route.push("/category/nike")}>
              <img src="https://www.freeiconspng.com/uploads/toyota-logo-png-25.png" className="w-[120px] hover:opacity-50" alt="" />
            </button>
            <button className="slide" onClick={() => route.push("/category/nike")}>
              <img src="https://i.pinimg.com/736x/dc/aa/15/dcaa15b604a36e80564c7a5008d888be.jpg" className="h-[70%] hover:opacity-50" alt="" />
            </button>
            <button className="slide" onClick={() => route.push("/category/nike")}>
              <img src="https://cdn4.iconfinder.com/data/icons/logos-brands-in-colors/660/kia-logo-new-512.png" className="w-[130px] hover:opacity-50" alt="" />
            </button>
            <button className="slide" onClick={() => route.push("/category/nike")}>
              <img src="https://iconlogovector.com/uploads/images/2025/05/lg-683aaeb69b683-Hisense.webp" className="w-[110px] hover:opacity-50" alt="" />
            </button>
            <button className="slide">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpje_CCUlUvR2DZK-0yj1ewCHk3GNIai2ojQ&s" className="w-[130px] hover:opacity-50" alt="" />
            </button>
            <button className="slide" onClick={() => route.push("/category/nike")}>
              <img src="/icons8-nike.svg" className="h-[80%] lg:h-full hover:opacity-50" alt="nike" title="nike" />
            </button>
          </div>
        </div>
      </section> */}




      {/* Categories */}
      <section className="py-8 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="mb-6 text-2xl font-bold">Browse by Category</h2>
          <div className="grid grid-cols-3 gap-4 md:grid-cols-5 lg:grid-cols-11">
            {[
              { href: "/category/electronics", icon: <Smartphone className="w-7 h-7" />, label: "Electronics" },
              { href: "/category/vehicles", icon: <Car className="w-7 h-7" />, label: "Vehicles" },
              { href: "/category/fashion", icon: <Shirt className="w-7 h-7" />, label: "Fashion" },
              { href: "/category/cosmetics", icon: <SoapDispenser className="scale-110" />, label: "Cosmetics" },
              { href: "/category/furniture", icon: <Sofa className="w-7 h-7" />, label: "Furniture" },
              { href: "/category/fitness", icon: <Dumbbell className="w-7 h-7" />, label: "Fitness" },
              { href: "/category/gaming", icon: <Gamepad2 className="w-7 h-7" />, label: "Gaming" },
              { href: "/properties", icon: <HomeIcon className="w-7 h-7" />, label: "Property" },
              { href: "/category/books", icon: <BookOpen className="w-7 h-7" />, label: "Books" },
              { href: "/jobs", icon: <Briefcase className="w-7 h-7" />, label: "Jobs" },
              { href: "/services", icon: <Wrench className="w-7 h-7" />, label: "Services" },
            ].map(({ href, icon, label }) => (
              <Link key={href} href={href} className="group flex flex-col items-center gap-1">
                <div className="flex items-center justify-center w-16 h-16 bg-white border border-gray-200 rounded-xl shadow-sm transition-all group-hover:border-primary group-hover:bg-primary/5 group-hover:shadow-md text-gray-600 group-hover:text-primary">
                  {icon}
                </div>
                <span className="text-xs text-center font-semibold text-gray-600 group-hover:text-primary transition-colors">{label}</span>
              </Link>
            ))}

          </div>
        </div>
      </section>


      {/* Featured Products */}
      <section ref={featuredRef} className="py-8 bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/category/all" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg aspect-square"></div>
                  <div className="h-4 mt-3 bg-gray-200 rounded"></div>
                  <div className="h-4 mt-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-10 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <h3 className="mb-3 text-xl font-extrabold tracking-tight">Huhu</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Ghana&apos;s largest online marketplace. Buy and sell cars, phones, fashions, properties, jobs and services.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/jobs" className="hover:text-white transition-colors">Jobs</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
              </ul>
            </div>
          </div>
          <div className="py-6 mt-8 flex flex-col md:flex-row items-center justify-between border-t border-gray-700 text-sm text-gray-500">
            <span>&copy; {new Date().getFullYear()} Huhu Ghana. All rights reserved.</span>
            <span className="mt-2 md:mt-0">Made with ❤️ in Ghana</span>
          </div>
        </div>
      </footer>

    </main>
  )
}