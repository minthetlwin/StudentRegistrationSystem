import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, UserPlus, GraduationCap, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  const cards = [
    {
      title: 'First Year Registration',
      description: 'New students joining the university for the first time.',
      icon: GraduationCap,
      color: 'bg-blue-500',
      link: '/register'
    },
    {
      title: 'Senior Registration',
      description: 'Continuing students registering for the new semester.',
      icon: UserPlus,
      color: 'bg-indigo-500',
      link: '/register'
    },
    {
      title: 'Dormitory',
      description: 'Apply for on-campus housing and facilities.',
      icon: Building2,
      color: 'bg-slate-700',
      link: '/register'
    }
  ]

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 bg-[#f8fafc]">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full text-center space-y-12"
      >
        <motion.div variants={itemVariants} className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
            Student <span className="text-indigo-600">Registration</span> Portal
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your all-in-one platform for university registration, dormitory applications, and academic tracking.
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
          {cards.map((card, index) => (
            <Link key={index} to={card.link}>
              <motion.div
                whileHover={{ y: -8 }}
                className="glass-card p-6 rounded-2xl h-full flex flex-col"
              >
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-slate-500 text-sm mb-6 flex-grow">{card.description}</p>
                <div className="flex items-center text-indigo-600 font-semibold text-sm group">
                  Get Started 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="pt-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-sm text-slate-600">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Registration for 2024-2025 is now open</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

