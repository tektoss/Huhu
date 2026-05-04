"use client"

import { useState } from "react"
import { Copy, Facebook, X } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { closeShareModal } from "@/lib/redux/slices/uiSlice"

export default function ShareModal() {
  const dispatch = useAppDispatch()
  const { shareModalOpen, currentProductUrl, currentProductTitle } = useAppSelector((state) => state.ui)
  const [copied, setCopied] = useState(false)

  if (!shareModalOpen) return null

  const handleCopyLink = () => {
    if (currentProductUrl) {
      navigator.clipboard.writeText(currentProductUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareUrl = currentProductUrl || (typeof window !== "undefined" ? window.location.href : "")
  const shareTitle = currentProductTitle || "Check out this listing on Huhu Ghana!"
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedText = encodeURIComponent(`${shareTitle} `)

  const platforms = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}${encodedUrl}`,
      bg: "bg-green-500 hover:bg-green-600",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      bg: "bg-blue-600 hover:bg-blue-700",
      icon: <Facebook className="w-6 h-6" />,
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      bg: "bg-black hover:bg-gray-800",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="white" viewBox="0 0 24 24">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      bg: "bg-blue-700 hover:bg-blue-800",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      bg: "bg-sky-500 hover:bg-sky-600",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
    {
      name: "SMS",
      href: `sms:?body=${encodedText}${encodedUrl}`,
      bg: "bg-gray-600 hover:bg-gray-700",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H5l-4 4V4c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v12z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => dispatch(closeShareModal())}>
      <div className="w-full max-w-md p-6 bg-white rounded-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Share</h2>
          <button onClick={() => dispatch(closeShareModal())} className="text-gray-500 hover:text-black" aria-label="Close share modal">
            <X className="w-6 h-6" />
          </button>
        </div>

        {currentProductTitle && (
          <p className="mb-4 text-sm text-gray-600 truncate">{currentProductTitle}</p>
        )}

        <p className="mb-3 text-sm font-medium text-gray-700">Share via</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {platforms.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target={p.name === "SMS" ? "_self" : "_blank"}
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center gap-2 py-3 px-2 text-white rounded-lg transition-colors ${p.bg}`}
            >
              {p.icon}
              <span className="text-xs font-medium">{p.name}</span>
            </a>
          ))}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Or copy link</p>
          <div className="flex">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none bg-gray-50 truncate"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center px-4 py-2 text-white bg-black rounded-r-md hover:bg-gray-800 text-sm font-medium whitespace-nowrap"
            >
              {copied ? "Copied!" : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
