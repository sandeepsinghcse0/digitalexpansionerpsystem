'use client';

import Link from "next/link";

export default function Home() {
  const modules = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "📊",
      description: "View business overview and analytics",
    },
    {
      name: "Inventory",
      href: "/inventory",
      icon: "📦",
      description: "Manage products and stock levels",
    },
    {
      name: "Invoices",
      href: "/invoices",
      icon: "📄",
      description: "Create and manage invoices",
    },
    {
      name: "Customers",
      href: "/customers",
      icon: "👥",
      description: "Manage customer information",
    },
    {
      name: "Expenses",
      href: "/expenses",
      icon: "📈",
      description: "Track business expenses",
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "📋",
      description: "Generate and view reports",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Digital Expansion ERP
              </h1>
            </div>
            <div className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                Dashboard
              </Link>
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-slate-900 text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Your ERP System
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Streamline your business operations with comprehensive management tools for inventory, invoicing, customers, and reporting.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/dashboard" className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition">
                Go to Dashboard
              </Link>
              <Link href="/login" className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition border border-blue-500">
                Login Account
              </Link>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Key Modules
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-12">
              Access all your business management tools in one place
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => {
                return (
                  <Link
                    key={module.name}
                    href={module.href}
                    className="group p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl group-hover:scale-110 transition-transform inline-block">{module.icon}</span>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Module</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {module.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {module.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white dark:bg-slate-800 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our ERP?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Real-time Analytics
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Get instant insights into your business performance with comprehensive dashboards and reports.
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Secure & Reliable
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Enterprise-grade security ensures your data is protected at all times.
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Fast & Efficient
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Streamline your operations and reduce manual work with automated workflows.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="text-white font-semibold mb-4">About</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Products</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
                <li><Link href="/inventory" className="hover:text-white transition">Inventory</Link></li>
                <li><Link href="/invoices" className="hover:text-white transition">Invoices</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm">&copy; 2026 Digital Expansion ERP. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="#" className="hover:text-white transition">Twitter</Link>
                <Link href="#" className="hover:text-white transition">LinkedIn</Link>
                <Link href="#" className="hover:text-white transition">GitHub</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}