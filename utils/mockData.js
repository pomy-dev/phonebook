import { Images } from '../constants/Images';

export const mockEvents = [
  {
    id: '1',
    title: 'Digital Transformation Summit 2025',
    description: 'Leading conference on digital innovation across industries',
    date: '2025-02-15',
    imageUrl: Images.event1,
    joinLink: 'support@techforward.net',
    location: 'San Francisco, CA',
    industry: 'Technology',
    company: 'TechForward Inc.',
    attendees: 450,
    type: 'conference'
  },
  {
    id: '2',
    title: 'Sustainable Manufacturing Workshop',
    description: 'Hands-on workshop for sustainable practices in manufacturing',
    date: '2025-02-20',
    imageUrl: Images.event2,
    joinLink: 'contact@greenmanufacturing.org',
    location: 'Detroit, MI',
    industry: 'Manufacturing',
    company: 'Green Manufacturing Co.',
    attendees: 85,
    maxAttendees: 100,
    type: 'workshop'
  },
  {
    id: '3',
    title: 'Healthcare Innovation Network',
    description: 'Networking event for healthcare professionals and innovators',
    date: '2025-02-25',
    imageUrl: Images.event3,
    location: 'Boston, MA',
    industry: 'Healthcare',
    company: 'MedInnovate',
    attendees: 200,
    maxAttendees: 250,
    type: 'networking'
  },
  {
    id: '4',
    title: 'Financial Services Seminar',
    description: 'Latest trends and regulations in financial services',
    date: '2025-03-01',
    imageUrl: Images.event4,
    joinLink: 'support@financefirst.net',
    location: 'New York, NY',
    industry: 'Finance',
    company: 'FinanceFirst',
    attendees: 150,
    maxAttendees: 200,
    type: 'seminar'
  },
  {
    id: '5',
    title: 'Renewable Energy Conference',
    description: 'Exploring the future of sustainable energy solutions',
    date: '2025-03-05',
    imageUrl: Images.event5,
    location: 'Austin, TX',
    industry: 'Energy',
    company: 'GreenTech Solutions',
    attendees: 320,
    maxAttendees: 400,
    type: 'conference'
  },
  {
    id: '6',
    title: 'Agricultural Innovation Workshop',
    description: 'Modern farming techniques and sustainable agriculture',
    date: '2025-03-10',
    imageUrl: Images.event5,
    location: 'Des Moines, IA',
    industry: 'Agriculture',
    company: 'AgriTech Corp',
    attendees: 75,
    maxAttendees: 120,
    type: 'workshop'
  }
];

export const mockVacancies = [
  {
    id: '1',
    industry: 'Technology',
    type: 'full-time',
    description: 'Join our team to optimize manufacturing processes and implement lean manufacturing principles.',
    imageUrl: Images.vacancy1,
    postedDate: '2025-01-15',
    recruitmentEmail: 'mdzeshh@gmail.com'
  },
  {
    id: '2',
    industry: 'Manufacturing',
    type: 'full-time',
    description: 'We are looking for a senior software engineer to join our growing team and lead development of our core platform.',
    imageUrl: Images.vacancy2,
    postedDate: '2025-01-18',
  },
  {
    id: '3',
    industry: 'Healthcare',
    type: 'full-time',
    imageUrl: Images.vacancy3,
    postedDate: '2025-01-20',
    recruitmentEmail: 'mdzeshh@gmail.com'
  },
  {
    id: '4',
    industry: 'Marketing',
    type: 'full-time',
    imageUrl: Images.vacancy4,
    postedDate: '2025-01-22'
  },
  {
    id: '5',
    industry: 'Education',
    type: 'full-time',
    imageUrl: Images.vacancy5,
    postedDate: '2025-01-25',
    recruitmentEmail: 'mdzeshh@gmail.com'
  },
  {
    id: '6',
    industry: 'Manufacturing',
    type: 'part-time',
    description: 'Coordinate clinical trials and ensure compliance with regulatory requirements.',
    imageUrl: Images.vacancy6,
    postedDate: '2025-01-25'
  },
  {
    id: '7',
    industry: 'Oil & Gas',
    type: 'part-time',
    description: 'Lead marketing campaigns and brand strategy for diverse client portfolio.',
    imageUrl: Images.vacancy7,
    postedDate: '2025-01-25',
    recruitmentEmail: 'mdzeshh@gmail.com'
  },
  {
    id: '8',
    industry: 'Education',
    type: 'full-time',
    imageUrl: Images.vacancy8,
    postedDate: '2025-01-25'
  },
  {
    id: '9',
    industry: 'Finance',
    type: 'full-time',
    imageUrl: Images.vacancy9,
    postedDate: '2025-01-25',
    recruitmentEmail: 'mdzeshh@gmail.com'
  },
  {
    id: '10',
    industry: 'Marketing',
    type: 'full-time',
    description: 'Passionate educator needed for 3rd grade classroom with focus on STEM integration.',
    imageUrl: Images.vacancy10,
    postedDate: '2025-01-25',
    recruitmentEmail: 'mdzeshh@gmail.com'
  },
  {
    id: '11',
    industry: 'Energy',
    type: 'part-time',
    imageUrl: Images.vacancy11,
    postedDate: '2025-01-25'
  }
];

export const mockTenders = [
  {
    id: '1',
    imageUrl: Images.tender1,
    industry: 'Technology',
    description: 'Development of a comprehensive enterprise resource planning system with modern technologies.',
    enquiryEmail: 'tenders@company.com',
    postedDate: '2025-01-10',
  },
  {
    id: '2',
    imageUrl: Images.tender2,
    industry: 'Manufacturing',
    description: 'Design and implementation of automated manufacturing line with IoT integration.',
    enquiryEmail: 'tenders@company.com',
    postedDate: '2025-01-05',
  },
  {
    id: '3',
    imageUrl: Images.tender3,
    industry: 'Healthcare',
    description: 'Complete hospital management system with patient records, billing, and scheduling.',
    postedDate: '2025-01-12',
  },
  {
    id: '4',
    imageUrl: Images.tender4,
    industry: 'Energy',
    description: 'Solar panel installation and grid integration for municipal buildings.',
    enquiryEmail: 'tenders@company.com',
    postedDate: '2025-01-08',
  },
  {
    id: '5',
    imageUrl: Images.tender5,
    industry: 'Agriculture',
    postedDate: '2025-01-08',
  },
  {
    id: '6',
    imageUrl: Images.tender6,
    industry: 'Glass & Ceramics',
    description: 'Solar panel installation and grid integration for municipal buildings.',
    enquiryEmail: 'tenders@company.com',
    postedDate: '2025-01-08',
  },
  {
    id: '7',
    imageUrl: Images.tender7,
    industry: 'Construction',
    description: 'Complete hospital management system with patient records, billing, and scheduling.',
    enquiryEmail: 'tenders@company.com',
    postedDate: '2025-01-08',
  },
  {
    id: '8',
    imageUrl: Images.tender8,
    industry: 'Transportation',
    postedDate: '2025-01-08',
  },
  {
    id: '9',
    imageUrl: Images.tender9,
    industry: 'Retail',
    enquiryEmail: 'tenders@company.com',
    postedDate: '2025-01-08',
  },
  {
    id: '10',
    imageUrl: Images.tender10,
    industry: 'Telecommunications',
    postedDate: '2025-01-08',
  },
  {
    id: '11',
    imageUrl: Images.tender11,
    industry: 'Government',
    description: 'Complete hospital management system with patient records, billing, and scheduling.',
    postedDate: '2025-01-08',
  },
  {
    id: '12',
    imageUrl: Images.tender12,
    industry: 'Fashion',
    description: 'Development of a comprehensive enterprise resource planning system with modern technologies.',
    enquiryEmail: 'tenders@company.com',
    postedDate: '2025-01-08',
  }
];

export const mockInternships = [
  {
    id: '1',
    imageUrl: Images.intern1,
    industry: 'Technology',
    description: 'Development of a comprehensive enterprise resource planning system with modern technologies.',
    enquiryEmail: 'tenders@company.com',
    postedDate: '2025-01-10',
  },
  {
    id: '2',
    imageUrl: Images.intern2,
    industry: 'Manufacturing',
    description: 'Design and implementation of automated manufacturing line with IoT integration.',
    enquiryEmail: 'tenders@company.com',
    postedDate: '2025-01-05',
  },
  {
    id: '3',
    imageUrl: Images.intern3,
    industry: 'Healthcare',
    description: 'Complete hospital management system with patient records, billing, and scheduling.',
    postedDate: '2025-01-12',
  },
  {
    id: '4',
    imageUrl: Images.intern4,
    industry: 'Energy',
    description: 'Solar panel installation and grid integration for municipal buildings.',
    enquiryEmail: 'tenders@company.com',
    postedDate: '2025-01-08',
  },
  {
    id: '5',
    imageUrl: Images.intern5,
    industry: 'Agriculture',
    postedDate: '2025-01-08',
  },
  {
    id: '6',
    imageUrl: Images.intern6,
    industry: 'Education',
    description: 'Solar panel installation and grid integration for municipal buildings.',
    enquiryEmail: 'tenders@company.com',
    postedDate: '2025-01-08',
  },
  {
    id: '7',
    imageUrl: Images.intern7,
    industry: 'Engineering',
    description: 'Complete hospital management system with patient records, billing, and scheduling.',
    enquiryEmail: 'tenders@company.com',
    postedDate: '2025-01-08',
  }
];

export const mockProfiles = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer',
    company: 'TechInnovate Corp',
    location: 'San Francisco, CA',
    industry: 'Technology',
    experience: '8 years',
    email: 'sarah.johnson@techinnovate.com',
    phone: '+1 (415) 555-0123',
    whatsapp: '+1 (415) 555-0123',
    acquiredSkills: ['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL', 'Docker'],
    innateSkills: ['Problem Solving', 'Critical Thinking', 'Leadership', 'Communication'],
    domesticSkills: ['Time Management', 'Organization', 'Multitasking'],
    achievements: [
      'Led team of 12 developers on flagship product',
      'Reduced system latency by 40%',
      'AWS Certified Solutions Architect'
    ],
    education: 'BS Computer Science, Stanford University',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      github: 'https://github.com/sarahjohnson',
      twitter: 'https://twitter.com/sarahjohnson',
      website: 'https://sarahjohnson.dev'
    },
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailableForWork: false
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    title: 'Manufacturing Operations Manager',
    company: 'Industrial Dynamics',
    location: 'Detroit, MI',
    industry: 'Manufacturing',
    experience: '12 years',
    email: 'michael.rodriguez@industrialdynamics.com',
    phone: '+1 (313) 555-0456',
    whatsapp: '+1 (313) 555-0456',
    acquiredSkills: ['Lean Manufacturing', 'Six Sigma', 'Quality Control', 'Supply Chain'],
    innateSkills: ['Team Leadership', 'Strategic Thinking', 'Attention to Detail'],
    domesticSkills: ['Project Management', 'Budgeting', 'Scheduling'],
    achievements: [
      'Implemented lean processes reducing waste by 25%',
      'Black Belt Six Sigma certification',
      'Managed $50M+ manufacturing operations'
    ],
    education: 'MS Industrial Engineering, University of Michigan',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/michaelrodriguez',
      twitter: 'https://twitter.com/mrodriguez'
    },
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailableForWork: true
  },
  {
    id: '3',
    name: 'Dr. Emily Chen',
    title: 'Clinical Research Director',
    company: 'BioPharma Solutions',
    location: 'Boston, MA',
    industry: 'Healthcare',
    experience: '15 years',
    email: 'emily.chen@biopharmasolutions.com',
    phone: '+1 (617) 555-0789',
    whatsapp: '+1 (617) 555-0789',
    acquiredSkills: ['Clinical Trials', 'FDA Regulations', 'Biostatistics', 'Protocol Development'],
    innateSkills: ['Analytical Thinking', 'Research Methodology', 'Team Management'],
    domesticSkills: ['Documentation', 'Compliance Management', 'Data Organization'],
    achievements: [
      'Led 20+ successful clinical trials',
      'Published 45+ peer-reviewed papers',
      'FDA Breakthrough Therapy designation'
    ],
    education: 'PhD Biomedical Sciences, Harvard Medical School',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/emilychen',
      website: 'https://dremilychen.com'
    },
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailableForWork: false
  },
  {
    id: '4',
    name: 'David Thompson',
    title: 'Financial Analyst',
    company: 'Investment Partners LLC',
    location: 'New York, NY',
    industry: 'Finance',
    experience: '6 years',
    email: 'david.thompson@investmentpartners.com',
    phone: '+1 (212) 555-0321',
    whatsapp: '+1 (212) 555-0321',
    acquiredSkills: ['Financial Modeling', 'Risk Analysis', 'Excel', 'Python', 'Bloomberg Terminal'],
    innateSkills: ['Analytical Thinking', 'Risk Assessment', 'Portfolio Management'],
    domesticSkills: ['Data Management', 'Report Writing', 'Client Communication'],
    achievements: [
      'CFA Charterholder',
      'Generated 15% alpha on managed portfolio',
      'Led M&A analysis for $2B+ deals'
    ],
    education: 'MBA Finance, Wharton School',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/davidthompson',
      twitter: 'https://twitter.com/dthompsonfinance'
    },
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailableForWork: true
  },
  {
    id: '5',
    name: 'Maria Garcia',
    title: 'Marketing Director',
    company: 'Brand Innovators',
    location: 'Miami, FL',
    industry: 'Marketing',
    experience: '10 years',
    email: 'maria.garcia@brandinnovators.com',
    phone: '+1 (305) 555-0654',
    whatsapp: '+1 (305) 555-0654',
    acquiredSkills: ['Digital Marketing', 'Brand Strategy', 'Social Media', 'Analytics'],
    innateSkills: ['Creativity', 'Strategic Thinking', 'Content Creation'],
    domesticSkills: ['Campaign Management', 'Client Relations', 'Budget Planning'],
    achievements: [
      'Increased brand awareness by 300%',
      'Google Ads certified professional',
      'Led campaigns generating $10M+ revenue'
    ],
    education: 'MBA Marketing, University of Miami',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/mariagarcia',
      instagram: 'https://instagram.com/mariagarcia_marketing',
      twitter: 'https://twitter.com/mariagarcia',
      website: 'https://mariagarcia.marketing'
    },
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailableForWork: false
  },
  {
    id: '6',
    name: 'James Wilson',
    title: 'Elementary School Principal',
    company: 'Riverside Elementary',
    location: 'Seattle, WA',
    industry: 'Education',
    experience: '18 years',
    email: 'james.wilson@riversideelementary.edu',
    phone: '+1 (206) 555-0987',
    whatsapp: '+1 (206) 555-0987',
    acquiredSkills: ['Educational Leadership', 'Curriculum Development', 'Teacher Training'],
    innateSkills: ['Leadership', 'Communication', 'Student Assessment'],
    domesticSkills: ['Administrative Management', 'Event Planning', 'Community Outreach'],
    achievements: [
      'Improved school test scores by 40%',
      'Principal of the Year Award 2023',
      'Implemented innovative STEM program'
    ],
    education: 'EdD Educational Leadership, University of Washington',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/jameswilson',
      twitter: 'https://twitter.com/principalwilson'
    },
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailableForWork: true
  },
  {
    id: '7',
    name: 'Lisa Park',
    title: 'Renewable Energy Engineer',
    company: 'SolarTech Solutions',
    location: 'Phoenix, AZ',
    industry: 'Energy',
    experience: '7 years',
    email: 'lisa.park@solartech.com',
    phone: '+1 (602) 555-0147',
    whatsapp: '+1 (602) 555-0147',
    acquiredSkills: ['Solar Design', 'Grid Integration', 'Energy Storage', 'Project Management'],
    innateSkills: ['Problem Solving', 'Innovation', 'Sustainability Thinking'],
    domesticSkills: ['Technical Documentation', 'Client Presentations', 'Regulatory Compliance'],
    achievements: [
      'Designed 50+ MW solar installations',
      'NABCEP certified solar professional',
      'Reduced project costs by 20%'
    ],
    education: 'MS Renewable Energy Engineering, Arizona State University',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/lisapark',
      github: 'https://github.com/lisapark',
      website: 'https://lisapark.energy'
    },
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailableForWork: false
  },
  {
    id: '8',
    name: 'Robert Brown',
    title: 'Agricultural Specialist',
    company: 'FarmTech Innovations',
    location: 'Des Moines, IA',
    industry: 'Agriculture',
    experience: '14 years',
    email: 'robert.brown@farmtech.com',
    phone: '+1 (515) 555-0258',
    whatsapp: '+1 (515) 555-0258',
    acquiredSkills: ['Crop Management', 'Precision Agriculture', 'Soil Science', 'Irrigation Systems'],
    innateSkills: ['Data Analysis', 'Environmental Awareness', 'Innovation'],
    domesticSkills: ['Farm Management', 'Equipment Maintenance', 'Record Keeping'],
    achievements: [
      'Increased crop yields by 35%',
      'Certified Crop Advisor',
      'Pioneered drone-based crop monitoring'
    ],
    education: 'MS Agronomy, Iowa State University',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/robertbrown',
      twitter: 'https://twitter.com/agritech_rob'
    },
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailableForWork: true
  }
];

export const allIndustries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Education',
  'Marketing',
  'Energy',
  'Agriculture',
  'Construction',
  'Transportation',
  'Retail',
  'Hospitality',
  'Real Estate',
  'Legal',
  'Consulting',
  'Media',
  'Telecommunications',
  'Automotive',
  'Aerospace',
  'Biotechnology',
  'Pharmaceuticals',
  'Food & Beverage',
  'Fashion',
  'Sports',
  'Non-profit',
  'Government',
  'Insurance',
  'Banking',
  'Entertainment',
  'Gaming',
  'Other'
];