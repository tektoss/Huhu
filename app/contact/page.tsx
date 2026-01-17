"use client"

import { FormEvent, useState } from "react"
import NavBar from "@/components/nav-bar"
import SimpleFooter from "@/components/simple-footer"
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react"
import { showToast } from "@/utils/showToast"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.message) {
        showToast("Please fill in all required fields", "error")
        setLoading(false)
        return
      }

      // Here you would typically send the form data to your backend
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      showToast("Message sent successfully! We'll get back to you soon.", "success")
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      showToast("Failed to send message. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <NavBar />

      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container px-4 mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-300">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <h2 className="text-xl font-bold mb-4">Get in Touch</h2>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">support@Huhu.com</p>
                    <p className="text-gray-600">info@Huhu.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">+233 XX XXX XXXX</p>
                    <p className="text-gray-600">Mon - Fri, 9am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-gray-600">Accra, Ghana</p>
                    <p className="text-gray-600">Greater Accra Region</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Social Media</h3>
                    <div className="flex gap-2 mt-2">
                      <a href="#" className="text-gray-600 hover:text-black">Facebook</a>
                      <span className="text-gray-300">|</span>
                      <a href="#" className="text-gray-600 hover:text-black">Twitter</a>
                      <span className="text-gray-300">|</span>
                      <a href="#" className="text-gray-600 hover:text-black">Instagram</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Shortcut */}
              <div className="bg-black text-white rounded-lg shadow p-6 mt-6">
                <h3 className="font-bold mb-2">Frequently Asked Questions</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Find quick answers to common questions about buying, selling, and using Huhu.
                </p>
                <a 
                  href="/faq" 
                  className="inline-block px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  View FAQs
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feedback">Feedback</option>
                      <option value="report">Report an Issue</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </main>
  )
}
