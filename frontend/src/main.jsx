import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { ToastProvider } from '@/components/Toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShortTest from '@/components/ShortTest'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Blog from '@/pages/Blog'
import BlogDetail from '@/pages/BlogDetail'
import Jobs from '@/pages/Jobs'
import Contact from '@/pages/Contact'
import SubmitBlog from '@/pages/SubmitBlog'
import Dashboard from '@/pages/Dashboard'

import Consulting from '@/pages/products/Consulting'
import Blockchain from '@/pages/products/Blockchain'
import AI from '@/pages/products/AI'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/submit-blog" element={<SubmitBlog />} />
                <Route path="/products/blockchain" element={<Blockchain />} />
                <Route path="/products/ai" element={<AI />} />
                <Route path="/products/consulting" element={<Consulting />} />
                <Route path="/application" element={<ShortTest />} />
                <Route path="/application" element={<ShortTest />} />
                <Route path="/contact/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
)
