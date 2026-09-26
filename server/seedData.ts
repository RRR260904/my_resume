export const initialSeedData = {
  profiles: [
    {
      name: "Roshan Madheswaran",
      role: "Junior Accountant & Computer Applications Specialist",
      tagline: "Bridging financial accuracy with modern computational skills — specialized in accounts, billing, reconciliation, and data analytics.",
      bio: "Detail-oriented professional with dual expertise in accounts management, cash handling, and computer applications (BCA). Experienced in daily billing, petty cash reconciliation, invoice verification, and closing reports at Hotel Aarthi. Certified in Data Analytics, Python Programming, and Web Development, with fluent multilingual communication across Tamil, English, Hindi, and Malayalam.",
      profile_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      resume_url: "#contact",
      location: "Salem, Tamil Nadu, India",
      years_of_experience: 1,
      available_for_work: true,
      email: "roshanhabakkuk0926@gmail.com",
      phone: "+91 93531 58660",
      is_active: true
    }
  ],
  about: [
    {
      title: "Precision in Accounts, Agility in Technology",
      description: "My career objective is to secure a dynamic position that utilizes my dual expertise in reception and accounts, enabling me to provide comprehensive operational and analytical support to the team while fostering a positive and productive work environment. Having graduated with an 83% in Bachelor of Computer Applications (BCA) and practical experience in commercial cash handling and bookkeeping, I combine numeric rigor with technology-driven workflows.",
      highlights: [
        "Hands-on experience managing daily billing, cash collections, and closing summaries at Hotel Aarthi, Salem",
        "Strong foundation in double-entry bookkeeping, petty cash tracking, and invoice validation",
        "BCA graduate from Vysya College (83%) with certifications in Data Analytics, Python, and AI Fundamentals",
        "Multilingual communicator fluent in Tamil, English, Hindi, and Malayalam for superior front-desk and team collaboration"
      ],
      quote: "Efficiency in accounting is not just balancing books; it is delivering clarity, transparency, and dependable operational support.",
      hobbies: [
        "Financial Data Analysis",
        "Python Coding Practice",
        "Tech & AI Exploration",
        "Language Learning"
      ],
      avatar_secondary: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      is_active: true
    }
  ],
  skills: [
    // Accounting & Operations
    { name: "Basic Accounting & Bookkeeping", category: "Accounting & Finance", proficiency: 92, icon: "BookOpen", featured: true, display_order: 1, is_active: true },
    { name: "Cash Handling & Billing", category: "Accounting & Finance", proficiency: 95, icon: "DollarSign", featured: true, display_order: 2, is_active: true },
    { name: "Expense Tracking & Reconciliation", category: "Accounting & Finance", proficiency: 90, icon: "FileSpreadsheet", featured: true, display_order: 3, is_active: true },
    { name: "Invoice Verification", category: "Accounting & Finance", proficiency: 92, icon: "CheckCircle2", featured: true, display_order: 4, is_active: true },
    { name: "Record Keeping & Documentation", category: "Accounting & Finance", proficiency: 94, icon: "FolderCheck", featured: false, display_order: 5, is_active: true },
    { name: "MS Excel (Formulas & Summaries)", category: "Accounting & Finance", proficiency: 88, icon: "Table", featured: true, display_order: 6, is_active: true },

    // Technical & Analytics
    { name: "Data Analytics", category: "Tech & Computing", proficiency: 85, icon: "BarChart3", featured: true, display_order: 7, is_active: true },
    { name: "Python Programming", category: "Tech & Computing", proficiency: 82, icon: "Code", featured: true, display_order: 8, is_active: true },
    { name: "Web Development (HTML, CSS, JS)", category: "Tech & Computing", proficiency: 80, icon: "Globe", featured: false, display_order: 9, is_active: true },
    { name: "Artificial Intelligence (Basics)", category: "Tech & Computing", proficiency: 78, icon: "Cpu", featured: false, display_order: 10, is_active: true },
    { name: "Digital Marketing", category: "Tech & Computing", proficiency: 82, icon: "Share2", featured: false, display_order: 11, is_active: true },

    // Languages
    { name: "Tamil (Native / Fluent)", category: "Languages & Communication", proficiency: 100, icon: "MessageSquare", featured: true, display_order: 12, is_active: true },
    { name: "English (Professional)", category: "Languages & Communication", proficiency: 90, icon: "MessageSquare", featured: true, display_order: 13, is_active: true },
    { name: "Hindi (Conversational)", category: "Languages & Communication", proficiency: 80, icon: "MessageSquare", featured: false, display_order: 14, is_active: true },
    { name: "Malayalam (Conversational)", category: "Languages & Communication", proficiency: 80, icon: "MessageSquare", featured: false, display_order: 15, is_active: true }
  ],
  experiences: [
    {
      company: "Hotel Aarthi, Salem",
      role: "Junior Accountant / Cashier",
      period: "June 2025 – December 2025",
      start_date: "2025-06",
      end_date: "2025-12",
      is_current: false,
      location: "Salem, Tamil Nadu",
      description: "Handled comprehensive day-to-day front-desk cashiering, ledger maintenance, customer billing, and voucher filing in a fast-paced hospitality environment.",
      responsibilities: [
        "Handled daily cash collections, point-of-sale billing, and customer payment processing with 100% register balance accuracy",
        "Maintained structured sales records, daily operational expenses, and petty cash disbursements",
        "Prepared daily closing reports, register audits, and basic financial summaries for management review",
        "Verified supplier invoices, vendor statements, and supporting expense documents",
        "Maintained systematic physical and digital filing of accounting vouchers, receipts, and tax records"
      ],
      technologies: ["Accounting & Billing", "Cash Reconciliation", "Invoice Verification", "MS Excel", "Record Keeping"],
      company_url: "",
      display_order: 1,
      is_active: true
    }
  ],
  education: [
    {
      institution: "Vysya College, Salem",
      degree: "Bachelor of Computer Applications (BCA)",
      field_of_study: "Computer Applications & Software Systems",
      period: "2022 – 2025",
      start_year: 2022,
      end_year: 2025,
      grade: "83% (First Class with Distinction)",
      activities: ["Technical Seminars", "Data Analytics Workshops", "Computer Science Projects"],
      description: "Completed rigorous BCA coursework focusing on Programming in Python, Database Management Systems, Web Development, Accounting Principles, and Computer Applications.",
      display_order: 1,
      is_active: true
    },
    {
      institution: "Sree Gokulam",
      degree: "Higher Secondary Certificate (12th Standard)",
      field_of_study: "Senior Secondary Education",
      period: "2020 – 2022",
      start_year: 2020,
      end_year: 2022,
      grade: "80%",
      activities: ["Academic Competitions", "School Activities"],
      description: "Successfully completed Higher Secondary school curriculum with an aggregate of 80%.",
      display_order: 2,
      is_active: true
    },
    {
      institution: "Sree Gokulam",
      degree: "Secondary School Leaving Certificate (10th Standard)",
      field_of_study: "General Secondary Education",
      period: "2019 – 2020",
      start_year: 2019,
      end_year: 2020,
      grade: "95% (Academic Distinction)",
      activities: ["Top Ranker", "Inter-school Quizzes"],
      description: "Achieved an exemplary 95% aggregate in 10th standard state board examinations.",
      display_order: 3,
      is_active: true
    }
  ],
  projects: [
    {
      title: "Hotel Billing & Cash Reconciliation System",
      slug: "hotel-billing-reconciliation",
      short_description: "A specialized daily financial management workflow for tracking front-office billing, expense allocations, and closing balances.",
      full_description: "Developed to streamline hotel accounting operations at Hotel Aarthi. The system captures daily counter receipts, categorizes petty cash disbursements, generates automated closing summaries, and checks for payment reconciliations against physical cash receipts and digital POS records.",
      thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
      ],
      technologies: ["MS Excel", "Accounting Principles", "Billing Management", "Financial Summary"],
      features: [
        "Automated daily cash register balancing and petty cash variance calculation",
        "Digital tracking of customer invoices, payments, and receipt vouchers",
        "Standardized closing reports ready for senior management review",
        "Invoice reconciliation against supplier delivery slips"
      ],
      problem: "Manual handwritten registers were prone to calculation errors during busy checkout hours and complicated month-end reconciliation.",
      solution: "Standardized invoice verification templates and daily closing balance formulas, eliminating discrepancies.",
      challenges: "Ensuring zero discrepancy between physical cash collected, card swipes, and ledger logs during peak rush.",
      github_url: "",
      live_demo_url: "",
      video_url: "",
      category: "Accounting & Finance",
      status: "Implemented",
      featured: true,
      display_order: 1,
      is_active: true
    },
    {
      title: "Revenue & Expense Analytics Dashboard",
      slug: "revenue-expense-analytics",
      short_description: "Interactive data analytics dashboard visualizing daily sales trends, recurring expenses, and cash flow patterns.",
      full_description: "Leveraging principles of Data Analytics and Python, this analytics module aggregates daily sales receipts and expense items into visual breakdown charts, allowing quick identification of expense spikes, popular revenue hours, and monthly profitability margins.",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
      ],
      technologies: ["Data Analytics", "Python", "MS Excel", "Data Visualization"],
      features: [
        "Visual breakdown of daily, weekly, and monthly revenue streams",
        "Expense category classification (inventory, maintenance, petty cash)",
        "Summary KPIs for average transaction value and daily cash inflow",
        "Exportable PDF and Excel reports for accounting records"
      ],
      problem: "Understanding overall business margins was difficult with scattered daily paper summaries.",
      solution: "Built a centralized analytics summary that compiles transaction records into clear visual charts.",
      challenges: "Structuring disparate transaction categories into standardized metric indicators.",
      github_url: "",
      live_demo_url: "",
      video_url: "",
      category: "Data Analytics",
      status: "Completed",
      featured: true,
      display_order: 2,
      is_active: true
    },
    {
      title: "Front-Desk Guest & Inquiry Management Portal",
      slug: "guest-inquiry-portal",
      short_description: "Responsive web portal designed for receptionists to record guest queries, booking details, and room inquiries.",
      full_description: "Designed using responsive web development fundamentals (HTML, CSS, JavaScript) to give front-office staff an intuitive dashboard to log customer check-ins, record special requests, and facilitate smooth communication between shifts.",
      thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
      ],
      technologies: ["Web Development", "HTML5", "CSS3", "JavaScript"],
      features: [
        "Clean, responsive front-desk interface for rapid guest entry",
        "Filterable log of pending inquiries, room requests, and contact details",
        "Shift handover notes log to maintain continuous reception service"
      ],
      problem: "Shift transitions frequently caused customer inquiries and follow-ups to be forgotten or delayed.",
      solution: "Created an easy-to-use digital portal accessible on any browser without complex installations.",
      challenges: "Keeping the UI ultra-fast and accessible for counter staff with minimal clicks.",
      github_url: "",
      live_demo_url: "",
      video_url: "",
      category: "Web Development",
      status: "Completed",
      featured: false,
      display_order: 3,
      is_active: true
    }
  ],
  certifications: [
    {
      title: "Data Analytics",
      issuer: "Professional Skills Development",
      issue_date: "2025",
      expiry_date: "",
      credential_id: "DA-CERT-2025",
      credential_url: "",
      badge_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80",
      skills: ["Data Analysis", "Excel Analytics", "Data Visualization", "Financial Reporting"],
      display_order: 1,
      is_active: true
    },
    {
      title: "Python Programming",
      issuer: "Computer Applications Certification",
      issue_date: "2024",
      expiry_date: "",
      credential_id: "PY-CERT-2024",
      credential_url: "",
      badge_image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
      skills: ["Python Fundamentals", "Data Structures", "Scripting", "Automation"],
      display_order: 2,
      is_active: true
    },
    {
      title: "Web Development (Basic)",
      issuer: "Technical Education Institute",
      issue_date: "2024",
      expiry_date: "",
      credential_id: "WEB-DEV-2024",
      credential_url: "",
      badge_image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=400&q=80",
      skills: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
      display_order: 3,
      is_active: true
    },
    {
      title: "Artificial Intelligence (Basics)",
      issuer: "AI & Emerging Technologies",
      issue_date: "2024",
      expiry_date: "",
      credential_id: "AI-BASIC-2024",
      credential_url: "",
      badge_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
      skills: ["AI Fundamentals", "Machine Learning Overview", "Prompt Engineering", "Applied AI"],
      display_order: 4,
      is_active: true
    },
    {
      title: "Digital Marketing",
      issuer: "Digital Marketing Academy",
      issue_date: "2024",
      expiry_date: "",
      credential_id: "DM-CERT-2024",
      credential_url: "",
      badge_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
      skills: ["SEO", "Social Media Branding", "Online Outreach", "Marketing Analytics"],
      display_order: 5,
      is_active: true
    }
  ],
  achievements: [
    {
      title: "95% Distinction in 10th Standard (Secondary Education)",
      description: "Scored 95% aggregate marks with academic honors at Sree Gokulam school.",
      date: "2020",
      metric: "95% Marks",
      organization: "Sree Gokulam",
      link: "",
      icon: "Trophy",
      display_order: 1,
      is_active: true
    },
    {
      title: "83% First-Class Distinction in BCA",
      description: "Graduated with 83% overall aggregate in Bachelor of Computer Applications from Vysya College, Salem.",
      date: "2025",
      metric: "83% Aggregate",
      organization: "Vysya College, Salem",
      link: "",
      icon: "Award",
      display_order: 2,
      is_active: true
    },
    {
      title: "Multilingual Front-Desk & Customer Communication",
      description: "Fluent across 4 languages: Tamil, English, Hindi, and Malayalam, providing superior service during guest reception and client interactions.",
      date: "2025",
      metric: "4 Languages",
      organization: "Professional Skill",
      link: "",
      icon: "Star",
      display_order: 3,
      is_active: true
    }
  ],
  social_links: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/roshan-madheswaran", username: "roshan-madheswaran", display_order: 1, is_active: true },
    { platform: "GitHub", url: "https://github.com/roshanmadheswaran", username: "roshanmadheswaran", display_order: 2, is_active: true },
    { platform: "Email", url: "mailto:roshanhabakkuk0926@gmail.com", username: "roshanhabakkuk0926@gmail.com", display_order: 3, is_active: true }
  ],
  contact_info: [
    {
      email: "roshanhabakkuk0926@gmail.com",
      phone: "+91 93531 58660",
      location: "Salem, Tamil Nadu, India",
      working_hours: "09:00 AM - 06:30 PM (Mon - Sat)",
      availability_note: "Available for full-time opportunities in Junior Accounting, Cashiering, Reception, and Computer Applications Administration.",
      is_active: true
    }
  ],
  contact_messages: [],
  site_settings: [
    {
      site_title: "Roshan Madheswaran | Junior Accountant & BCA Portfolio",
      meta_description: "Professional portfolio of Roshan Madheswaran showcasing expertise in Accounts, Cash Handling, Billing, Bookkeeping, Data Analytics, Python, and BCA qualifications.",
      og_image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
      keywords: "Roshan Madheswaran, Junior Accountant, Cashier, BCA, Vysya College, Salem, Accounting, Bookkeeping, Python, Data Analytics, Portfolio",
      enable_glow_effects: true,
      theme_accent_color: "blue-indigo",
      footer_text: "Portfolio of Roshan Madheswaran. Dynamic data powered by MongoDB.",
      is_active: true
    }
  ]
};
