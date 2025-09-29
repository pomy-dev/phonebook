import { Images } from '../constants/Images';

export const mockEvents = [
  {
    id: '1',
    title: 'Digital Transformation Summit 2025',
    description: 'Leading conference on digital innovation across industries',
    date: '2025-02-15',
    location: 'San Francisco, CA',
    industry: 'Technology',
    company: 'TechForward Inc.',
    attendees: 450,
    maxAttendees: 500,
    type: 'conference'
  },
  {
    id: '2',
    title: 'Sustainable Manufacturing Workshop',
    description: 'Hands-on workshop for sustainable practices in manufacturing',
    date: '2025-02-20',
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
    imageUrl: Images.vacancy1,
    postedDate: '2025-01-15',
    recruitmentEmail: 'mdzeshh@gmail.com'
  },
  {
    id: '2',
    industry: 'Manufacturing',
    type: 'full-time',
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
    imageUrl: Images.vacancy6,
    postedDate: '2025-01-25'
  },
  {
    id: '7',
    industry: 'Oil & Gas',
    type: 'part-time',
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
    enquiryEmail: 'tenders@company.com',
    postedDate: '2025-01-10',
  },
  {
    id: '2',
    imageUrl: Images.tender2,
    industry: 'Manufacturing',
    enquiryEmail: 'tenders@company.com',
    postedDate: '2025-01-05',
  },
  {
    id: '3',
    imageUrl: Images.tender3,
    industry: 'Healthcare',
    postedDate: '2025-01-12',
  },
  {
    id: '4',
    imageUrl: Images.tender4,
    industry: 'Energy',
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
    enquiryEmail: 'tenders@company.com',
    postedDate: '2025-01-08',
  },
  {
    id: '7',
    imageUrl: Images.tender7,
    industry: 'Construction',
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
    postedDate: '2025-01-08',
  },
  {
    id: '12',
    imageUrl: Images.tender12,
    industry: 'Fashion',
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
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL', 'Docker'],
    achievements: [
      'Led team of 12 developers on flagship product',
      'Reduced system latency by 40%',
      'AWS Certified Solutions Architect'
    ],
    education: 'BS Computer Science, Stanford University',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
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
    skills: ['Lean Manufacturing', 'Six Sigma', 'Quality Control', 'Supply Chain', 'Team Leadership'],
    achievements: [
      'Implemented lean processes reducing waste by 25%',
      'Black Belt Six Sigma certification',
      'Managed $50M+ manufacturing operations'
    ],
    education: 'MS Industrial Engineering, University of Michigan',
    linkedinUrl: 'https://linkedin.com/in/michaelrodriguez',
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
    skills: ['Clinical Trials', 'FDA Regulations', 'Biostatistics', 'Protocol Development', 'Team Management'],
    achievements: [
      'Led 20+ successful clinical trials',
      'Published 45+ peer-reviewed papers',
      'FDA Breakthrough Therapy designation'
    ],
    education: 'PhD Biomedical Sciences, Harvard Medical School',
    linkedinUrl: 'https://linkedin.com/in/emilychen',
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
    skills: ['Financial Modeling', 'Risk Analysis', 'Excel', 'Python', 'Bloomberg Terminal', 'Portfolio Management'],
    achievements: [
      'CFA Charterholder',
      'Generated 15% alpha on managed portfolio',
      'Led M&A analysis for $2B+ deals'
    ],
    education: 'MBA Finance, Wharton School',
    linkedinUrl: 'https://linkedin.com/in/davidthompson',
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
    skills: ['Digital Marketing', 'Brand Strategy', 'Social Media', 'Analytics', 'Content Creation'],
    achievements: [
      'Increased brand awareness by 300%',
      'Google Ads certified professional',
      'Led campaigns generating $10M+ revenue'
    ],
    education: 'MBA Marketing, University of Miami',
    linkedinUrl: 'https://linkedin.com/in/mariagarcia',
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
    skills: ['Educational Leadership', 'Curriculum Development', 'Teacher Training', 'Student Assessment'],
    achievements: [
      'Improved school test scores by 40%',
      'Principal of the Year Award 2023',
      'Implemented innovative STEM program'
    ],
    education: 'EdD Educational Leadership, University of Washington',
    linkedinUrl: 'https://linkedin.com/in/jameswilson',
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
    skills: ['Solar Design', 'Grid Integration', 'Energy Storage', 'Project Management', 'Sustainability'],
    achievements: [
      'Designed 50+ MW solar installations',
      'NABCEP certified solar professional',
      'Reduced project costs by 20%'
    ],
    education: 'MS Renewable Energy Engineering, Arizona State University',
    linkedinUrl: 'https://linkedin.com/in/lisapark',
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
    skills: ['Crop Management', 'Precision Agriculture', 'Soil Science', 'Irrigation Systems', 'Data Analysis'],
    achievements: [
      'Increased crop yields by 35%',
      'Certified Crop Advisor',
      'Pioneered drone-based crop monitoring'
    ],
    education: 'MS Agronomy, Iowa State University',
    linkedinUrl: 'https://linkedin.com/in/robertbrown',
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