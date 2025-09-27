import { Event, Vacancy, Tender, Profile } from './types';

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
    title: 'Senior Software Engineer',
    company: 'TechCorp Solutions',
    location: 'Remote',
    salary: '$120,000 - $160,000',
    description: 'We are looking for a senior software engineer to join our growing team and lead development of our core platform.',
    requirements: ['5+ years React/React Native', 'TypeScript expertise', 'Cloud deployment experience'],
    industry: 'Technology',
    type: 'full-time',
    postedDate: '2025-01-15',
    deadline: '2025-02-15',
    applicants: 47
  },
  {
    id: '2',
    title: 'Manufacturing Process Engineer',
    company: 'Industrial Dynamics',
    location: 'Chicago, IL',
    salary: '$85,000 - $110,000',
    description: 'Join our team to optimize manufacturing processes and implement lean manufacturing principles.',
    requirements: ['Bachelor in Engineering', 'Lean Six Sigma certification', '3+ years manufacturing experience'],
    industry: 'Manufacturing',
    type: 'full-time',
    postedDate: '2025-01-18',
    deadline: '2025-02-18',
    applicants: 23
  },
  {
    id: '3',
    title: 'Clinical Research Coordinator',
    company: 'MedResearch Institute',
    location: 'San Diego, CA',
    salary: '$65,000 - $85,000',
    description: 'Coordinate clinical trials and ensure compliance with regulatory requirements.',
    requirements: ['Healthcare background', 'Clinical research experience', 'Attention to detail'],
    industry: 'Healthcare',
    type: 'full-time',
    postedDate: '2025-01-20',
    deadline: '2025-02-20',
    applicants: 31
  },
  {
    id: '4',
    title: 'Marketing Manager',
    company: 'Creative Agency Plus',
    location: 'Los Angeles, CA',
    salary: '$75,000 - $95,000',
    description: 'Lead marketing campaigns and brand strategy for diverse client portfolio.',
    requirements: ['Marketing degree', '4+ years experience', 'Digital marketing expertise'],
    industry: 'Marketing',
    type: 'full-time',
    postedDate: '2025-01-22',
    deadline: '2025-02-22',
    applicants: 89
  },
  {
    id: '5',
    title: 'Elementary School Teacher',
    company: 'Sunshine Elementary',
    location: 'Portland, OR',
    salary: '$45,000 - $65,000',
    description: 'Passionate educator needed for 3rd grade classroom with focus on STEM integration.',
    requirements: ['Teaching certification', 'Bachelor in Education', 'Classroom management skills'],
    industry: 'Education',
    type: 'full-time',
    postedDate: '2025-01-25',
    deadline: '2025-02-25',
    applicants: 12
  }
];

export const mockTenders = [
  {
    id: '1',
    title: 'Enterprise Software Development',
    company: 'Global Corp',
    description: 'Development of a comprehensive enterprise resource planning system with modern technologies.',
    budget: '$500,000 - $750,000',
    deadline: '2025-03-15',
    industry: 'Technology',
    requirements: ['Full-stack development team', 'Cloud architecture expertise', '24/7 support capability'],
    location: 'Nationwide',
    postedDate: '2025-01-10',
    status: 'open',
    bidders: 15
  },
  {
    id: '2',
    title: 'Factory Automation System',
    company: 'Manufacturing Solutions Ltd',
    description: 'Design and implementation of automated manufacturing line with IoT integration.',
    budget: '$1,200,000 - $1,800,000',
    deadline: '2025-02-28',
    industry: 'Manufacturing',
    requirements: ['Industrial automation experience', 'IoT implementation', 'Safety compliance expertise'],
    location: 'Texas',
    postedDate: '2025-01-05',
    status: 'closing-soon',
    bidders: 8
  },
  {
    id: '3',
    title: 'Hospital Management System',
    company: 'Regional Health Network',
    description: 'Complete hospital management system with patient records, billing, and scheduling.',
    budget: '$300,000 - $450,000',
    deadline: '2025-04-01',
    industry: 'Healthcare',
    requirements: ['Healthcare software experience', 'HIPAA compliance', 'Integration capabilities'],
    location: 'California',
    postedDate: '2025-01-12',
    status: 'open',
    bidders: 22
  },
  {
    id: '4',
    title: 'Renewable Energy Infrastructure',
    company: 'Green Power Initiative',
    description: 'Solar panel installation and grid integration for municipal buildings.',
    budget: '$2,000,000 - $3,500,000',
    deadline: '2025-03-20',
    industry: 'Energy',
    requirements: ['Solar installation expertise', 'Grid integration experience', 'Municipal project history'],
    location: 'Arizona',
    postedDate: '2025-01-08',
    status: 'open',
    bidders: 6
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