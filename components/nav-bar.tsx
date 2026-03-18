"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, Heart, LogIn, Menu, MessageCircle, PlusCircle, Search, User, X } from "lucide-react"
// import { useAuth } from '@/lib/auth/context/AuthContext';
// import { subscribeToUserChats, type Chat } from "@/lib/firebase/chats"
import { useAuthUser } from "@/lib/auth/hooks/useAuthUser"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth/utils/logout"


export default function NavBar() {
  const { user } = useAuthUser();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0)

  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  // const { user, logout } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const term = searchQuery.trim()
    if (!term) return
    router.push(`/category/${encodeURIComponent(term)}`)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, []);

  // useEffect(() => {
  //   if (!user) {
  //     setUnreadCount(0)
  //     return
  //   }

  //   const unsubscribe = subscribeToUserChats(user.uid, (chats: Chat[]) => {
  //     const totalUnread = chats.reduce((total, chat) => {
  //       return total + (chat.unreadCount[user.uid] || 0)
  //     }, 0)
  //     setUnreadCount(totalUnread)
  //   })

  //   return unsubscribe
  // }, [user])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [mobileMenuOpen])

  const handleLogout = async () => {
    try {
      await logout(router);
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <nav className="sticky top-0 z-10 bg-primary border-b shadow-sm">
      {/* App download bar */}
      <div className="bg-secondary">
        <div className="container px-4 mx-auto flex items-center justify-center gap-3 py-1.5 text-xs font-semibold text-primary flex-wrap">
          <span className="hidden sm:inline">Get the Huhu app</span>
          <a
            href="https://apps.apple.com/gh/app/huhu/id6473089394"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download on the App Store"
            className="flex items-center gap-1.5 px-3 py-1 bg-primary text-white rounded-full hover:bg-primary-light transition-colors"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            App Store
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.nudiance.app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get it on Google Play"
            className="flex items-center gap-1.5 px-3 py-1 bg-primary text-white rounded-full hover:bg-primary-light transition-colors"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3.18 23.76c.3.17.64.24.99.19l12.52-7.23-2.81-2.81-10.7 9.85zM.54 1.03C.2 1.4 0 1.96 0 2.67v18.67c0 .71.2 1.27.54 1.63l.09.08 10.46-10.46v-.25L.63.95.54 1.03zM20.4 10.65l-2.97-1.72-3.17 3.17 3.17 3.17 2.99-1.73c.85-.49.85-1.4-.02-1.89zM3.18.24l12.52 7.23-2.81 2.81L2.19.43A1.25 1.25 0 013.18.24z"/>
            </svg>
            Google Play
          </a>
        </div>
      </div>

      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center mt-1">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/huhu-logo-light.svg"
              alt="Huhu Marketplace"
              width={100}
              height={92}
              className="h-18 w-20"
            />
            <span className="text-xl font-bold text-white hidden sm:inline">Huhu</span>
          </Link>
        </div>

        {/* Search Bar - Hidden on mobile, visible on medium screens and up */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="What are you looking to buy"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button type="submit" className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Navigation Icons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          

          {user ? (
            <>
              <Link href="/wishlist" className="p-2 rounded-full hover:bg-gray-100 group">
                <Heart className="w-6 h-6 text-white group-hover:text-primary" />
              </Link>
              <Link href="/notifications" className="p-2 rounded-full hover:bg-gray-100 group">
                <Bell className="w-6 h-6 text-white group-hover:text-primary" />
              </Link>
              <Link href="/chat" className="relative p-2 rounded-full hover:bg-gray-100 group">
                <MessageCircle className="w-6 h-6 text-white group-hover:text-primary" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                {/* <MessageCircle className="w-6 h-6 text-white group-hover:text-primary" /> */}
              </Link>
              <Link href={`/profile/${user.uid}`} className="p-2 rounded-full hover:bg-gray-100 group">
                {user.photoURL ? (
                  <div className="relative w-6 h-6 overflow-hidden rounded-full">
                    <Image
                      src={user.photoURL || "/userprofile.jpg"}
                      alt={user.displayName || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <User className="w-6 h-6 text-white group-hover:text-primary" />
                )}
              </Link>
              <Link
                href="/categories"
                className="flex items-center px-4 py-2 text-primary bg-secondary hover:bg-secondary-light rounded-md"
              >
                <PlusCircle className="w-4 h-4 mr-2 text-primary" />
                New Post
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="flex items-center px-4 py-2 text-primary bg-secondary hover:bg-secondary-light rounded-md hover:bg-gray-800"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex md:hidden items-center p-2 rounded-full hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          {/* Mobile Menu Slide-in Panel */}
          <div
            ref={menuRef}
            className="fixed top-0 right-0 z-50 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
          >
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User Info (if logged in) */}
              {user && (
                <div className="p-4 border-b">
                  <div className="flex items-center">
                    <div className="relative w-10 h-10 mr-3 overflow-hidden rounded-full bg-gray-200">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL || "/user_placeholder.png"}
                          alt={user.displayName || "User"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user.displayName || "User"}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Bar */}
              <div className="p-4 border-b">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button type="submit" className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <Search className="w-5 h-5" />
                  </button>
                </form>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto">
                <div className="py-2">
                  {!user ? (
                    <Link
                      href="/signin"
                      className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn className="w-5 h-5 mr-3" />
                      <span>Sign In</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-3 text-left text-gray-800 hover:bg-gray-100"
                    >
                      <LogIn className="w-5 h-5 mr-3 rotate-180" />
                      <span>Sign Out</span>
                    </button>
                  )}

                  {user && (<>
                    <Link
                      href={`/profile/${user.uid}`}
                      className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5 mr-3" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/wishlist"
                      className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Heart className="w-5 h-5 mr-3" />
                      <span>Wishlist</span>
                    </Link>
                    <Link
                      href="/notifications"
                      className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Bell className="w-5 h-5 mr-3" />
                      <span>Notifications</span>
                    </Link>
                    <Link
                      href="/chat"
                      className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="relative mr-3">
                      <MessageCircle className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </div>
                    <span>Messages</span>
                    {unreadCount > 0 && <span className="ml-auto text-xs text-red-500">{unreadCount}</span>}
                    </Link>
                  </>)}
                </div>
              </div>

              {/* New Post Button */}
              <div className="p-4 border-t">
                <Link
                  href={user ? "/categories" : "/signin"}
                  className="flex items-center justify-center w-full px-4 py-2 text-white bg-primary rounded-md hover:primary-light"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {user ? "New Post" : "Sign In to Post"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}