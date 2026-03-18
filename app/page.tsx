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

      {/* Get the App Banner */}
      <section className="py-12 bg-primary">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center md:flex-row md:text-left md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white md:text-3xl">Take Huhu with you</h2>
              <p className="mt-2 text-white/75 max-w-md">
                Buy and sell on the go. Download the free Huhu app for iPhone and Android.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              {/* App Store */}
              <a
                href="https://apps.apple.com/gh/app/huhu/id6473089394"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 bg-white text-primary rounded-xl hover:bg-gray-100 transition-colors min-w-[160px]"
                aria-label="Download on the App Store"
              >
                <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left leading-tight">
                  <div className="text-[10px] font-medium opacity-75">Download on the</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </a>
              {/* Google Play */}
              <a
                href="https://play.google.com/store/apps/details?id=com.nudiance.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 bg-white text-primary rounded-xl hover:bg-gray-100 transition-colors min-w-[160px]"
                aria-label="Get it on Google Play"
              >
                <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3.18 23.76c.3.17.64.24.99.19l12.52-7.23-2.81-2.81-10.7 9.85zM.54 1.03C.2 1.4 0 1.96 0 2.67v18.67c0 .71.2 1.27.54 1.63l.09.08 10.46-10.46v-.25L.63.95.54 1.03zM20.4 10.65l-2.97-1.72-3.17 3.17 3.17 3.17 2.99-1.73c.85-.49.85-1.4-.02-1.89zM3.18.24l12.52 7.23-2.81 2.81L2.19.43A1.25 1.25 0 013.18.24z"/>
                </svg>
                <div className="text-left leading-tight">
                  <div className="text-[10px] font-medium opacity-75">Get it on</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
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
              <div className="flex flex-col sm:flex-row gap-2 mt-5">
                <a
                  href="https://apps.apple.com/gh/app/huhu/id6473089394"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-white text-sm"
                  aria-label="Download on the App Store"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.nudiance.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-white text-sm"
                  aria-label="Get it on Google Play"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3.18 23.76c.3.17.64.24.99.19l12.52-7.23-2.81-2.81-10.7 9.85zM.54 1.03C.2 1.4 0 1.96 0 2.67v18.67c0 .71.2 1.27.54 1.63l.09.08 10.46-10.46v-.25L.63.95.54 1.03zM20.4 10.65l-2.97-1.72-3.17 3.17 3.17 3.17 2.99-1.73c.85-.49.85-1.4-.02-1.89zM3.18.24l12.52 7.23-2.81 2.81L2.19.43A1.25 1.25 0 013.18.24z"/>
                  </svg>
                  Google Play
                </a>
              </div>
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