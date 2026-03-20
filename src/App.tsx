import { LoanForm } from "./components/LoanForm";
import { ShieldCheck, BarChart3 } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="bg-primary rounded-xl p-2 shadow-lg shadow-primary/20">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            {/* Text Logo */}
            <div className="flex flex-col justify-center leading-none">
              <span className="text-2xl font-black text-primary tracking-tighter">bznz</span>
              <span className="text-sm font-bold text-gray-500 tracking-widest uppercase -mt-1">loans.com</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-6 text-sm font-semibold text-gray-600">
              <a href="#" className="hover:text-primary transition-colors">How it Works</a>
              <a href="#" className="hover:text-primary transition-colors">About Us</a>
              <a href="#" className="hover:text-primary transition-colors">Reviews</a>
            </nav>
            <div className="h-8 w-px bg-gray-200" />
            <a href="tel:1-888-501-1070" className="flex flex-col items-end">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Call Us Now</span>
              <span className="font-bold text-xl text-primary hover:text-primary/80 transition-colors">1-888-501-1070</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent font-bold text-sm tracking-wide mb-4">
            FAST & SECURE FUNDING
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
            Get the Capital Your Business Needs to <span className="text-primary relative inline-block">
              Grow
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Check your eligibility in minutes with no impact to your credit score. 
            We connect you with top lenders competing for your business.
          </p>
        </div>
        
        <LoanForm />

        {/* Trust Badges */}
        <div className="mt-20 border-t border-gray-200 pt-10">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Trusted by Business Owners Nationwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Trustpilot Placeholder */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-2xl text-gray-800">Trustpilot</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-5 h-5 bg-[#00b67a] text-white flex items-center justify-center text-[10px]">★</div>
                ))}
              </div>
            </div>
            
            {/* BBB Placeholder */}
            <div className="flex items-center gap-2 border-2 border-gray-300 rounded px-2 py-1">
              <span className="font-bold text-xl text-gray-700">BBB</span>
              <span className="text-sm font-bold text-gray-500 ml-1">ACCREDITED</span>
            </div>

            {/* McAfee Placeholder */}
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-red-600" />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-lg text-gray-800">McAfee</span>
                <span className="text-xs font-bold text-gray-500">SECURE</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
               <div className="bg-gray-100 rounded-lg p-1.5">
                <BarChart3 className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-lg font-bold text-gray-700">bznzloans.com</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-primary transition-colors">Do Not Sell My Info</a>
            </div>
          </div>
          <div className="text-center md:text-left text-xs text-gray-400 leading-relaxed max-w-4xl">
            <p className="mb-4">
              &copy; {new Date().getFullYear()} bznzloans.com. All rights reserved. 
            </p>
            <p>
              bznzloans.com is a marketing lead generator and is a Duly Licensed Mortgage Broker, as required by law, with its main office located at [Address]. 
              This website does not constitute an offer or solicitation to lend. bznzloans.com is not a lender and does not make loan or credit decisions. 
              We connect you with a network of lenders who may be able to assist you with your business funding needs.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;