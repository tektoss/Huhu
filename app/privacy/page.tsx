import NavBar from "@/components/nav-bar"
import SimpleFooter from "@/components/simple-footer"

export const metadata = {
  title: "Privacy Policy | Huhu",
  description: "Read our privacy policy to understand how Huhu collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <NavBar />

      <section className="py-12 bg-white">
        <div className="container px-4 mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: January 17, 2026</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                Welcome to Huhu. We respect your privacy and are committed to protecting 
                your personal data. This privacy policy will inform you about how we look after 
                your personal data when you visit our website and tell you about your privacy 
                rights and how the law protects you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="text-gray-600 mb-4">We may collect, use, store and transfer different kinds of personal data about you:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes email address, telephone numbers, and physical address.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform.</li>
                <li><strong>Profile Data:</strong> includes your username and password, purchases or sales made by you, your interests, preferences, feedback and survey responses.</li>
                <li><strong>Usage Data:</strong> includes information about how you use our website and services.</li>
                <li><strong>Marketing and Communications Data:</strong> includes your preferences in receiving marketing from us.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use the information we collect for various purposes:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To allow you to participate in interactive features of our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>To fulfill any other purpose for which you provide it</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We have implemented appropriate security measures to prevent your personal data 
                from being accidentally lost, used or accessed in an unauthorized way, altered or 
                disclosed. In addition, we limit access to your personal data to those employees, 
                agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
              <p className="text-gray-600 mb-4">
                We will only retain your personal data for as long as necessary to fulfill the 
                purposes we collected it for, including for the purposes of satisfying any legal, 
                accounting, or reporting requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Your Legal Rights</h2>
              <p className="text-gray-600 mb-4">Under certain circumstances, you have rights under data protection laws in relation to your personal data:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Request access</strong> to your personal data</li>
                <li><strong>Request correction</strong> of your personal data</li>
                <li><strong>Request erasure</strong> of your personal data</li>
                <li><strong>Object to processing</strong> of your personal data</li>
                <li><strong>Request restriction of processing</strong> your personal data</li>
                <li><strong>Request transfer</strong> of your personal data</li>
                <li><strong>Right to withdraw consent</strong></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar tracking technologies to track the activity on our 
                service and hold certain information. Cookies are files with small amount of data 
                which may include an anonymous unique identifier. You can instruct your browser 
                to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Third-Party Services</h2>
              <p className="text-gray-600 mb-4">
                We may employ third-party companies and individuals to facilitate our service, 
                provide the service on our behalf, perform service-related services or assist us 
                in analyzing how our service is used. These third parties have access to your 
                personal data only to perform these tasks on our behalf and are obligated not to 
                disclose or use it for any other purpose.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                Our service does not address anyone under the age of 18. We do not knowingly 
                collect personally identifiable information from anyone under the age of 18. 
                If you are a parent or guardian and you are aware that your child has provided 
                us with personal data, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any 
                changes by posting the new Privacy Policy on this page and updating the "Last 
                updated" date at the top of this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>By email: privacy@Huhu.com</li>
                <li>By visiting our contact page: <a href="/contact" className="text-black underline">Contact Us</a></li>
              </ul>
            </section>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </main>
  )
}
