import NavBar from "@/components/nav-bar"
import SimpleFooter from "@/components/simple-footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata = {
  title: "FAQ | Huhu",
  description: "Frequently asked questions about buying and selling on Huhu.",
}

const faqCategories = [
  {
    title: "Getting Started",
    questions: [
      {
        question: "How do I create an account on Huhu?",
        answer:
          "Creating an account is easy! Click on the 'Sign Up' button at the top right corner of the page. You can register using your email address or sign up with your Google account. Once registered, you can start buying and selling immediately.",
      },
      {
        question: "Is it free to use Huhu?",
        answer:
          "Yes, creating an account and browsing listings on Huhu is completely free. Posting basic ads is also free. We may offer premium features for enhanced visibility in the future.",
      },
      {
        question: "Do I need to verify my email?",
        answer:
          "Yes, we require email verification to ensure the security of your account and to build trust within our community. You'll receive a verification email shortly after signing up.",
      },
    ],
  },
  {
    title: "Buying on Huhu",
    questions: [
      {
        question: "How do I search for items?",
        answer:
          "You can use the search bar at the top of the page to search for specific items. You can also browse by categories such as Properties, Vehicles, Jobs, Services, and more. Use filters to narrow down results by location, price range, and other criteria.",
      },
      {
        question: "How do I contact a seller?",
        answer:
          "Each listing has contact information provided by the seller. You can reach out via the phone number or email displayed on the listing. We recommend communicating through the platform for your safety.",
      },
      {
        question: "Is it safe to buy on Huhu?",
        answer:
          "We take safety seriously. Always meet sellers in public places, inspect items before paying, and never send money in advance without seeing the product. If a deal seems too good to be true, it probably is. Report suspicious listings to us immediately.",
      },
      {
        question: "Can I save listings to view later?",
        answer:
          "Yes! You can add listings to your wishlist by clicking the heart icon on any listing. Access your saved items anytime from your wishlist page.",
      },
    ],
  },
  {
    title: "Selling on Huhu",
    questions: [
      {
        question: "How do I post an ad?",
        answer:
          "Click on 'Post Ad' or 'Sell' button, select the appropriate category for your item, fill in the details including title, description, price, and photos, then submit. Your ad will be live shortly after.",
      },
      {
        question: "How many photos can I upload?",
        answer:
          "You can upload up to 10 photos per listing. We recommend using clear, well-lit photos from multiple angles to attract more buyers.",
      },
      {
        question: "How do I edit or delete my listing?",
        answer:
          "Go to your profile and find your active listings. Click on the listing you want to modify and select 'Edit' to make changes or 'Delete' to remove it completely.",
      },
      {
        question: "How long will my ad stay active?",
        answer:
          "Listings typically remain active for 30 days. You can renew or repost your ad if it expires and the item is still available.",
      },
      {
        question: "What items are prohibited from selling?",
        answer:
          "Prohibited items include illegal goods, weapons, drugs, counterfeit products, stolen items, adult content, and anything that violates our terms of service. Please review our full list of prohibited items before posting.",
      },
    ],
  },
  {
    title: "Properties & Rentals",
    questions: [
      {
        question: "How do I list a property for rent?",
        answer:
          "Navigate to 'Post Ad' and select 'Property' as the category. Fill in details like property type, location, rent price, number of bedrooms/bathrooms, amenities, and upload photos. Provide accurate contact information for potential tenants.",
      },
      {
        question: "What information should I include in a property listing?",
        answer:
          "Include property type, exact location, rent price, lease duration, number of bedrooms and bathrooms, available amenities (parking, security, furnished, etc.), and clear photos of the property. The more details you provide, the more qualified leads you'll receive.",
      },
      {
        question: "How do I find roommates?",
        answer:
          "Browse our property listings filtered for shared accommodations or post your own listing specifying you're looking for a roommate. Include your preferences and house rules to find compatible matches.",
      },
    ],
  },
  {
    title: "Account & Security",
    questions: [
      {
        question: "How do I reset my password?",
        answer:
          "Click on 'Sign In' then select 'Forgot Password'. Enter your registered email address and we'll send you a link to reset your password.",
      },
      {
        question: "How do I update my profile information?",
        answer:
          "Go to your profile settings by clicking on your profile icon. From there, you can update your name, phone number, email, and profile picture.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "If you wish to delete your account, please contact our support team at support@Huhu.com. Note that this action is permanent and all your data, including listings, will be removed.",
      },
      {
        question: "What should I do if I see a suspicious listing?",
        answer:
          "Click the 'Report' button on the listing and select the reason for reporting. Our team reviews all reports and takes appropriate action to maintain a safe marketplace.",
      },
    ],
  },
  {
    title: "Payments & Transactions",
    questions: [
      {
        question: "Does Huhu handle payments?",
        answer:
          "Currently, Huhu is a classifieds platform that connects buyers and sellers. We do not process payments directly. All transactions are conducted between the buyer and seller. We recommend using secure payment methods and meeting in person when possible.",
      },
      {
        question: "What payment methods should I accept?",
        answer:
          "We recommend accepting mobile money (MTN MoMo, Vodafone Cash, AirtelTigo Money), bank transfers, or cash on delivery. Always verify payment before handing over items.",
      },
      {
        question: "What if I get scammed?",
        answer:
          "Report the incident to us immediately through our contact page. Also file a report with the local police. To prevent scams, never pay in advance, always meet in public places, and verify the item before paying.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <NavBar />

      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container px-4 mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-300">
            Find answers to common questions about using Huhu.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container px-4 mx-auto max-w-4xl">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-10">
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200">
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {/* Still Have Questions */}
          <div className="mt-12 p-8 bg-gray-50 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-4">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </main>
  )
}
