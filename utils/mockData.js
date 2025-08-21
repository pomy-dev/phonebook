import { Images } from "./Images";

export const mockPublications = [
  {
    id: "1",
    name: "RSTP",
    industry: "Technology",
    logo: Images.RstpLogo,
    phoneNumbers: [
      { type: "WhatsApp", number: "+26878012345" },
      { type: "Call", number: "+26824045678" },
    ],
    email: "contact@rstp.co.sz",
    publications: [
      {
        id: "1-1",
        title: "AI-Powered Analytics Platform Launched",
        teaser: "Revolutionizing data analysis for businesses.",
        image: Images.RstpMainArticle,
        intro: "The Royal Science & Technology Park has launched a groundbreaking AI-powered analytics platform.",
        paragraphs: [
          "The platform integrates advanced machine learning algorithms for real-time insights.",
          "It ensures businesses of all sizes can harness AI without extensive expertise.",
        ],
        postedDate: "2025-08-01",
      },
      {
        id: "1-2",
        title: "RSTP Expands Cloud Services",
        teaser: "New cloud solutions for scalable business growth.",
        image: Images.RstpSubArticle,
        intro: "RSTP introduces cloud services to enhance business scalability.",
        paragraphs: [
          "The services offer secure, flexible solutions for data storage and processing.",
          "Integration with existing platforms is seamless, boosting efficiency.",
        ],
        postedDate: "2025-07-15",
      },
      {
        id: "1-3",
        title: "Quantum Computing Research Breakthrough",
        teaser: "Pioneering the future of computational power.",
        image: Images.RstpQuantum,
        intro: "RSTP announces a major breakthrough in quantum computing research.",
        paragraphs: [
          "The new quantum algorithms promise unprecedented processing speeds.",
          "Collaborations with global tech firms are underway to commercialize the technology.",
        ],
        postedDate: "2025-06-10",
      },
    ],
    socialLinks: [
      {
        name: "LinkedIn",
        icon: "linkedin",
        color: "#0077B5",
        url: 'https://linkedin.com'
      },
      {
        name: "Twitter",
        icon: "twitter",
        color: "#1DA1F2",
        url: 'https://twitter.com'
      },
      {
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        url: 'https://facebook.com'
      }
    ]
  },
  {
    id: "2",
    name: "Standard Bank",
    industry: "Finance",
    logo: Images.StandardBankLogo,
    phoneNumbers: [
      { type: "Call", number: "+27112345678" },
      { type: "WhatsApp", number: "+27119876543" },
      { type: "Call", number: "+27110012345" },
    ],
    email: "info@standardbank.co.sz",
    publications: [
      {
        id: "2-1",
        title: "Standard Bank Secures $50M Funding",
        teaser: "Driving eco-friendly investment opportunities.",
        image: Images.StandardBankMain,
        intro: "Standard Bank Solutions announced a $50M funding round for sustainable investments.",
        paragraphs: [
          "The company supports renewable energy projects and green startups.",
          "The funding enhances GreenFin's digital platform for investors.",
        ],
        postedDate: "2025-06-20",
      },
      {
        id: "2-2",
        title: "Mobile Banking App Upgrade",
        teaser: "Enhanced features for seamless banking.",
        image: Images.StandardBankApp,
        intro: "Standard Bank rolls out a major update to its mobile banking app.",
        paragraphs: [
          "New features include biometric authentication and real-time budgeting tools.",
          "The app now supports cross-border transactions with lower fees.",
        ],
        postedDate: "2025-05-25",
      },
      {
        id: "2-3",
        title: "Partnership with FinTech Startups",
        teaser: "Boosting innovation in financial services.",
        image: Images.StandardBankFintech,
        intro: "Standard Bank partners with FinTech startups to drive innovation.",
        paragraphs: [
          "The collaboration focuses on blockchain-based payment solutions.",
          "Startups gain access to Standard Bank’s extensive network and resources.",
        ],
        postedDate: "2025-04-15",
      },
    ],
    socialLinks: [
      {
        name: "Website",
        icon: "globe",
        color: "#60A5FA",
        url: 'https://company.com/'
      },
      {
        name: "LinkedIn",
        icon: "linkedin",
        color: "#0077B5",
        url: 'https://linkedin.com'
      },
      {
        name: "Twitter",
        icon: "twitter",
        color: "#1DA1F2",
        url: 'https://twitter.com'
      },
      {
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        url: 'https://facebook.com'
      },
      {
        name: "Instagram",
        icon: "instagram",
        color: "#C13584",
        url: 'https://instagram.com'
      }
    ]
  },
  {
    id: "3",
    name: "The Luke Commission",
    industry: "Healthcare",
    logo: Images.LukeLogo,
    phoneNumbers: [
      { type: "Call", number: "+26825098765" },
    ],
    email: "support@lukecommission.org",
    publications: [
      {
        id: "3-1",
        title: "Telemedicine Expansion in eSwatini",
        teaser: "Bringing healthcare to rural communities.",
        image: Images.LukeMainArticle,
        intro: "HealthCare Plus rolls out telemedicine to improve access in underserved regions.",
        paragraphs: [
          "The initiative includes virtual consultations and mobile health units.",
          "Partnerships with local clinics support regional expansion.",
        ],
        postedDate: "2025-05-10",
      },
      {
        id: "3-2",
        title: "Mobile Clinic Outreach Program",
        teaser: "Delivering care to remote areas.",
        image: Images.LukeSubArticle,
        intro: "The Luke Commission launches a mobile clinic outreach program.",
        paragraphs: [
          "Mobile clinics provide free health screenings and vaccinations.",
          "The program targets rural communities with limited healthcare access.",
        ],
        postedDate: "2025-04-20",
      },
      {
        id: "3-3",
        title: "HIV Awareness Campaign",
        teaser: "Educating communities on prevention and treatment.",
        image: Images.LukeHivCampaign,
        intro: "The Luke Commission initiates an HIV awareness campaign.",
        paragraphs: [
          "The campaign includes community workshops and free testing.",
          "Partnerships with NGOs amplify the campaign’s reach.",
        ],
        postedDate: "2025-03-15",
      },
    ],
    socialLinks: [
      {
        name: "Website",
        icon: "globe",
        color: "#60A5FA",
        url: 'https://company.com/'
      },
      {
        name: "LinkedIn",
        icon: "linkedin",
        color: "#0077B5",
        url: 'https://linkedin.com'
      },
      {
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        url: 'https://facebook.com'
      }
    ]
  },
  {
    id: "4",
    name: "MozTel",
    industry: "Telecommunications",
    logo: Images.MozTelLogo,
    country: "Mozambique",
    phoneNumbers: [
      { type: "WhatsApp", number: "+25884123456" },
      { type: "Call", number: "+25882134567" },
    ],
    email: "contact@moztel.co.mz",
    publications: [
      {
        id: "4-1",
        title: "5G Network Rollout in Maputo",
        teaser: "High-speed connectivity for urban centers.",
        image: Images.MozTel5G,
        intro: "MozTel launches 5G network services in Maputo.",
        paragraphs: [
          "The 5G network offers ultra-fast internet for businesses and consumers.",
          "Expansion to other cities is planned for 2026.",
        ],
        postedDate: "2025-07-30",
      },
      {
        id: "4-2",
        title: "Affordable Data Plans Launched",
        teaser: "Accessible internet for all Mozambicans.",
        image: Images.MozTelData,
        intro: "MozTel introduces affordable data plans for low-income users.",
        paragraphs: [
          "The plans include unlimited social media access at reduced rates.",
          "The initiative aims to bridge the digital divide in rural areas.",
        ],
        postedDate: "2025-06-15",
      },
      {
        id: "4-3",
        title: "Fiber Optic Expansion",
        teaser: "Enhancing broadband infrastructure.",
        image: Images.MozTelFiber,
        intro: "MozTel expands its fiber optic network across Mozambique.",
        paragraphs: [
          "The project improves internet reliability for businesses.",
          "New infrastructure supports smart city initiatives.",
        ],
        postedDate: "2025-05-01",
      },
    ],
    socialLinks: [
      {
        name: "Website",
        icon: "globe",
        color: "#60A5FA",
        url: 'https://company.com/'
      },
      {
        name: "LinkedIn",
        icon: "linkedin",
        color: "#0077B5",
        url: 'https://linkedin.com'
      },
      {
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        url: 'https://facebook.com'
      }
    ]
  },
  {
    id: "5",
    name: "EcoEnergy",
    industry: "Energy",
    logo: Images.EcoEnergyLogo,
    country: "South Africa",
    phoneNumbers: [
      { type: "Call", number: "+27115678901" },
      { type: "WhatsApp", number: "+27119890123" },
    ],
    email: "info@ecoenergy.co.za",
    publications: [
      {
        id: "5-1",
        title: "Solar Farm Project Launched",
        teaser: "Powering communities with renewable energy.",
        image: Images.EcoEnergySolar,
        intro: "EcoEnergy launches a new solar farm in Johannesburg.",
        paragraphs: [
          "The solar farm generates 100 MW of clean energy.",
          "It supports South Africa’s renewable energy goals.",
        ],
        postedDate: "2025-08-10",
      },
      {
        id: "5-2",
        title: "Wind Energy Expansion",
        teaser: "Harnessing wind power for sustainability.",
        image: Images.EcoEnergyWind,
        intro: "EcoEnergy expands its wind energy projects in Cape Town.",
        paragraphs: [
          "New wind turbines increase capacity by 50 MW.",
          "The project creates jobs in local communities.",
        ],
        postedDate: "2025-07-01",
      },
      {
        id: "5-3",
        title: "Energy Storage Solutions",
        teaser: "Innovative battery technology for reliability.",
        image: Images.EcoEnergyBattery,
        intro: "EcoEnergy introduces advanced energy storage systems.",
        paragraphs: [
          "The batteries store excess renewable energy for peak demand.",
          "The technology reduces reliance on fossil fuels.",
        ],
        postedDate: "2025-06-05",
      },
    ],
    socialLinks: [
      {
        name: "Website",
        icon: "globe",
        color: "#60A5FA",
        url: 'https://company.com/'
      },
      {
        name: "LinkedIn",
        icon: "linkedin",
        color: "#0077B5",
        url: 'https://linkedin.com'
      },
      {
        name: "Twitter",
        icon: "twitter",
        color: "#1DA1F2",
        url: 'https://twitter.com'
      },
      {
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        url: 'https://facebook.com'
      },
      {
        name: "Instagram",
        icon: "instagram",
        color: "#C13584",
        url: 'https://instagram.com'
      }
    ]
  },
  {
    id: "6",
    name: "SwaziAgri",
    industry: "Agriculture",
    logo: Images.SwaziAgriLogo,
    country: "eSwatini",
    phoneNumbers: [
      { type: "Call", number: "+26826012345" },
      { type: "WhatsApp", number: "+26826067890" },
      { type: "Call", number: "+26826054321" },
    ],
    email: "contact@swaziagri.co.sz",
    publications: [
      {
        id: "6-1",
        title: "Organic Farming Initiative",
        teaser: "Promoting sustainable agriculture practices.",
        image: Images.SwaziAgriOrganic,
        intro: "SwaziAgri launches an organic farming initiative.",
        paragraphs: [
          "The initiative trains farmers in sustainable techniques.",
          "Organic produce is now exported to regional markets.",
        ],
        postedDate: "2025-07-20",
      },
      {
        id: "6-2",
        title: "Smart Irrigation Systems",
        teaser: "Optimizing water use for crops.",
        image: Images.SwaziAgriIrrigation,
        intro: "SwaziAgri introduces smart irrigation technology.",
        paragraphs: [
          "The systems reduce water waste by 30%.",
          "Farmers report higher crop yields with less water.",
        ],
        postedDate: "2025-06-10",
      },
      {
        id: "6-3",
        title: "AgriTech Training Program",
        teaser: "Empowering farmers with technology.",
        image: Images.SwaziAgriTraining,
        intro: "SwaziAgri launches an AgriTech training program.",
        paragraphs: [
          "The program teaches farmers to use drones and IoT devices.",
          "Over 500 farmers have enrolled in the first phase.",
        ],
        postedDate: "2025-05-05",
      },
    ],
    socialLinks: [
      {
        name: "Twitter",
        icon: "twitter",
        color: "#1DA1F2",
        url: 'https://twitter.com'
      },
      {
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        url: 'https://facebook.com'
      },
      {
        name: "Instagram",
        icon: "instagram",
        color: "#C13584",
        url: 'https://instagram.com'
      }
    ]
  },
  {
    id: "7",
    name: "Womens' Clinic",
    industry: "Healthcare",
    logo: Images.WomenClinicLogo,
    country: "eSwatini",
    phoneNumbers: [
      { type: "Call", number: "+26827012345" },
      { type: "WhatsApp", number: "+26827067890" },
    ],
    email: "info@eswatinihealth.co.sz",
    publications: [
      {
        id: "7-1",
        title: "New Hospital in Manzini",
        teaser: "Expanding healthcare infrastructure.",
        image: Images.WomenClinicHospital,
        intro: "Eswatini Health opens a new hospital in Manzini.",
        paragraphs: [
          "The hospital features state-of-the-art diagnostic equipment.",
          "It serves over 10,000 patients monthly.",
        ],
        postedDate: "2025-08-01",
      },
      {
        id: "7-2",
        title: "Vaccination Drive Success",
        teaser: "Protecting communities from diseases.",
        image: Images.WomenClinicVaccine,
        intro: "Eswatini Health completes a successful vaccination drive.",
        paragraphs: [
          "Over 50,000 people vaccinated against influenza.",
          "The drive targets both urban and rural areas.",
        ],
        postedDate: "2025-07-15",
      },
      {
        id: "7-3",
        title: "Mental Health Program Launch",
        teaser: "Supporting community well-being.",
        image: Images.WomenClinicMental,
        intro: "Eswatini Health launches a mental health support program.",
        paragraphs: [
          "The program offers free counseling services.",
          "Workshops promote mental health awareness.",
        ],
        postedDate: "2025-06-10",
      },
    ],
    socialLinks: [
      {
        name: "Website",
        icon: "globe",
        color: "#60A5FA",
        url: 'https://company.com/'
      },
      {
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        url: 'https://facebook.com'
      },
      {
        name: "Instagram",
        icon: "instagram",
        color: "#C13584",
        url: 'https://instagram.com'
      }
    ]
  },
];

export const mockPromotions = [
  {
    id: "1",
    name: "UNESWA",
    industry: "Education",
    logo: Images.UneswaLogo,
    country: "eSwatini",
    phoneNumbers: [
      { type: "WhatsApp", number: "+26878012345" },
      { type: "Call", number: "+26824045678" },
    ],
    email: "contact@uneswa.co.sz",
    ads: [
      {
        id: "1-1",
        title: "50% Off Part-time AI Classes",
        teaser: "Boost your intellect with discounted AI essentials.",
        image: Images.UneswaAd1,
        description: "Get 50% off our AI-powered analytics suite for the first year. Transform your data into actionable insights.",
        validUntil: "2025-09-30",
      },
      {
        id: "1-2",
        title: "Open Registration for Mature-Entry",
        teaser: "It's never later to start your career lessons, start now with us!",
        image: Images.UneswaAd2,
        description: "Register now for a mature entry classes that will set you up for your career. No commitment required.",
        validUntil: "2025-08-31",
      },
      {
        id: "1-3",
        title: "AI Summit 2025",
        teaser: "Join us for AI ground-breaking project launch.",
        image: Images.UneswaAd3,
        description: "Attend the Uneswa's first AI Summit 2025 in Mbabane. Connect with industry leaders and explore cutting-edge tech.",
        validUntil: "2025-10-15",
      },
    ],
    socialLinks: [
      {
        name: "LinkedIn",
        icon: "linkedin",
        color: "#0077B5",
        url: 'https://linkedin.com'
      },
      {
        name: "Twitter",
        icon: "twitter",
        color: "#1DA1F2",
        url: 'https://twitter.com'
      },
      {
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        url: 'https://facebook.com'
      },
      {
        name: "Instagram",
        icon: "instagram",
        color: "#C13584",
        url: 'https://instagram.com'
      }
    ]
  },
  {
    id: "2",
    name: "Goerge Hotel",
    industry: "Hospitality",
    logo: Images.GoergeLogo,
    country: "South Africa",
    phoneNumbers: [
      { type: "Call", number: "+27112345678" },
      { type: "WhatsApp", number: "+27119876543" },
      { type: "Call", number: "+27110012345" },
    ],
    email: "info@goergehotel.co.sz",
    ads: [
      {
        id: "2-1",
        title: "Zero-Fee Savings Account",
        teaser: "Open a savings account with no fees.",
        image: Images.GoergeAd1,
        description: "Open a new savings account with Standard Bank and enjoy zero monthly fees for the first year.",
        validUntil: "2025-09-15",
      },
      {
        id: "2-2",
        title: "Low-Interest Home Loans",
        teaser: "Affordable financing for your dream home.",
        image: Images.GoergeAd2,
        description: "Apply for a home loan with rates as low as 5%. Limited offer for new applicants.",
        validUntil: "2025-08-31",
      },
      {
        id: "2-3",
        title: "Cashback on Card Payments",
        teaser: "Earn rewards with every purchase.",
        image: Images.GeorgeAd3,
        description: "Use your Standard Bank card and get 5% cashback on all purchases until the end of the year.",
        validUntil: "2025-12-31",
      },
    ],
    socialLinks: [
      {
        name: "Website",
        icon: "globe",
        color: "#60A5FA",
        url: 'https://company.com/'
      },
      {
        name: "LinkedIn",
        icon: "linkedin",
        color: "#0077B5",
        url: 'https://linkedin.com'
      },
      {
        name: "Twitter",
        icon: "twitter",
        color: "#1DA1F2",
        url: 'https://twitter.com'
      },
      {
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        url: 'https://facebook.com'
      },
      {
        name: "Instagram",
        icon: "instagram",
        color: "#C13584",
        url: 'https://instagram.com'
      }
    ]
  },
  {
    id: "3",
    name: "Logico",
    industry: "Logistics",
    logo: Images.LogicoLogo,
    country: "eSwatini",
    phoneNumbers: [
      { type: "Call", number: "+26825098765" },
    ],
    email: "support@logico.org",
    ads: [
      {
        id: "3-1",
        title: "Free Health Checkup Camp",
        teaser: "Get a free health screening this month.",
        image: Images.LogicoAd1,
        description: "Visit our mobile clinics for free health checkups, including blood pressure and diabetes screenings.",
        validUntil: "2025-09-10",
      },
      {
        id: "3-2",
        title: "Discounted Telemedicine Plans",
        teaser: "Affordable virtual healthcare access.",
        image: Images.LogicoAd2,
        description: "Sign up for our telemedicine plans at 20% off for rural residents. Connect with doctors anytime.",
        validUntil: "2025-08-31",
      },
      {
        id: "3-3",
        title: "Health Awareness Workshop",
        teaser: "Learn about wellness and prevention.",
        image: Images.LogicoAd3,
        description: "Join our free health awareness workshops to learn about nutrition and disease prevention.",
        validUntil: "2025-09-20",
      },
    ],
    socialLinks: [
      {
        name: "LinkedIn",
        icon: "linkedin",
        color: "#0077B5",
        url: 'https://linkedin.com'
      },
      {
        name: "Twitter",
        icon: "twitter",
        color: "#1DA1F2",
        url: 'https://twitter.com'
      },
      {
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        url: 'https://facebook.com'
      }
    ]
  },
  {
    id: "4",
    name: "MozTel",
    industry: "Telecommunications",
    logo: Images.MozTelLogo,
    country: "Mozambique",
    phoneNumbers: [
      { type: "WhatsApp", number: "+25884123456" },
      { type: "Call", number: "+25882134567" },
    ],
    email: "contact@moztel.co.mz",
    ads: [
      {
        id: "4-1",
        title: "Unlimited 5G Data Offer",
        teaser: "Stay connected with unlimited 5G.",
        image: Images.MozTelAd1,
        description: "Get unlimited 5G data for just $10/month. Offer valid for new subscribers in Maputo.",
        validUntil: "2025-09-30",
      },
      {
        id: "4-2",
        title: "Free Smartphone with Plan",
        teaser: "Get a free phone with your subscription.",
        image: Images.MozTelAd2,
        description: "Sign up for our 24-month plan and receive a free smartphone. Limited stock available.",
        validUntil: "2025-08-31",
      },
    ],
    socialLinks: [
      {
        name: "Website",
        icon: "globe",
        color: "#60A5FA",
        url: 'https://company.com/'
      },
      {
        name: "LinkedIn",
        icon: "linkedin",
        color: "#0077B5",
        url: 'https://linkedin.com'
      },
      {
        name: "Twitter",
        icon: "twitter",
        color: "#1DA1F2",
        url: 'https://twitter.com'
      },
      {
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        url: 'https://facebook.com'
      },
      {
        name: "Instagram",
        icon: "instagram",
        color: "#C13584",
        url: 'https://instagram.com'
      }
    ]
  },
  {
    id: "5",
    name: "Clicks",
    industry: "Health",
    logo: Images.ClicksLogo,
    country: "South Africa",
    phoneNumbers: [
      { type: "Call", number: "+27115678901" },
      { type: "WhatsApp", number: "+27119890123" },
    ],
    email: "info@clicks.co.sz",
    ads: [
      {
        id: "5-1",
        title: "Solar Panel Installation Discount",
        teaser: "Go solar and save 25% on installation.",
        image: Images.ClicksAd1,
        description: "Install solar panels with EcoEnergy and save 25% on setup costs. Limited time offer.",
        validUntil: "2025-09-30",
      },
      {
        id: "5-2",
        title: "Free Energy Audit",
        teaser: "Optimize your energy usage for free.",
        image: Images.ClicksAd2,
        description: "Sign up for a free energy audit to reduce your electricity bills and carbon footprint.",
        validUntil: "2025-08-31",
      },
      {
        id: "5-3",
        title: "Wind Energy Subscription",
        teaser: "Switch to clean wind energy.",
        image: Images.ClicksAd3,
        description: "Subscribe to our wind energy plan and get 10% off your first year’s bill.",
        validUntil: "2025-09-15",
      },
    ],
    socialLinks: [
      {
        name: "Website",
        icon: "globe",
        color: "#60A5FA",
        url: 'https://company.com/'
      },
      {
        name: "LinkedIn",
        icon: "linkedin",
        color: "#0077B5",
        url: 'https://linkedin.com'
      },
      {
        name: "Twitter",
        icon: "twitter",
        color: "#1DA1F2",
        url: 'https://twitter.com'
      },
      {
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        url: 'https://facebook.com'
      },
      {
        name: "Instagram",
        icon: "instagram",
        color: "#C13584",
        url: 'https://instagram.com'
      }
    ]
  },
  {
    id: "6",
    name: "Sfundzani High",
    industry: "Education",
    logo: Images.SfundzaniLogo,
    country: "eSwatini",
    phoneNumbers: [
      { type: "Call", number: "+26826012345" },
      { type: "WhatsApp", number: "+26826067890" },
      { type: "Call", number: "+26826054321" },
    ],
    email: "contact@sfundzani.co.sz",
    ads: [
      {
        id: "6-1",
        title: "Grade Registration 4, 5, and 6 is Open",
        teaser: "Grab this opportunity, and plunch your child into knowledge.",
        image: Images.SfundzaniAd1,
        description: "Get 20% off our eco-friendly organic fertilizers. Perfect for sustainable farming.",
        validUntil: "2025-09-10",
      },
      {
        id: "6-2",
        title: "Free Farming Workshop",
        teaser: "Learn modern farming techniques.",
        image: Images.SfundzaniAd2,
        description: "Join our free workshop on smart irrigation and crop management. Limited seats.",
        validUntil: "2025-08-31",
      },
      {
        id: "6-3",
        title: "Discounted Seed Packs",
        teaser: "High-yield seeds at low prices.",
        image: Images.SfundzaniAd3,
        description: "Purchase our high-yield seed packs at a 15% discount for the planting season.",
        validUntil: "2025-09-20",
      },
    ],
    socialLinks: [
      {
        name: "LinkedIn",
        icon: "linkedin",
        color: "#0077B5",
        url: 'https://linkedin.com'
      },
      {
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        url: 'https://facebook.com'
      },
      {
        name: "Instagram",
        icon: "instagram",
        color: "#C13584",
        url: 'https://instagram.com'
      }
    ]
  },
  {
    id: "7",
    name: "Insurance",
    industry: "Law",
    logo: Images.InsuranceLogo,
    country: "Mozambique",
    phoneNumbers: [
      { type: "Call", number: "+25883123456" },
    ],
    email: "info@insurance.co.sz",
    ads: [
      {
        id: "7-1",
        title: "Free Shipping for New Clients",
        teaser: "Ship your goods at no cost.",
        image: Images.InsuranceAd1,
        description: "New clients get free shipping on their first order. Valid for deliveries within Mozambique.",
        validUntil: "2025-09-15",
      },
      {
        id: "7-2",
        title: "Warehouse Storage Discount",
        teaser: "Save 30% on storage services.",
        image: Images.InsuranceAd2,
        description: "Store your goods in our secure warehouses and save 30% for the first three months.",
        validUntil: "2025-08-31",
      },
      {
        id: "7-3",
        title: "Express Delivery Offer",
        teaser: "Fast delivery at reduced rates.",
        image: Images.InsuranceAd3,
        description: "Get express delivery services at 20% off for urgent shipments.",
        validUntil: "2025-09-10",
      },
    ],
    socialLinks: [
      {
        name: "Website",
        icon: "globe",
        color: "#60A5FA",
        url: 'https://company.com/'
      },
      {
        name: "LinkedIn",
        icon: "linkedin",
        color: "#0077B5",
        url: 'https://linkedin.com'
      },
      {
        name: "Twitter",
        icon: "twitter",
        color: "#1DA1F2",
        url: 'https://twitter.com'
      },
      {
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        url: 'https://facebook.com'
      },
      {
        name: "Instagram",
        icon: "instagram",
        color: "#C13584",
        url: 'https://instagram.com'
      }
    ]
  },
  {
    id: "8",
    name: "Africa Chicks",
    industry: "Agriculture",
    logo: Images.AfricaChicksLogo,
    country: "South Africa",
    phoneNumbers: [
      { type: "WhatsApp", number: "+27117890123" },
      { type: "Call", number: "+27115678902" },
    ],
    email: "support@africachicks.co.sz",
    ads: [
      {
        id: "8-1",
        title: "Free Cybersecurity Trial",
        teaser: "Protect your business for free.",
        image: Images.AfricachicksAd1,
        description: "Try our cybersecurity suite free for 30 days. Protect your data from threats.",
        validUntil: "2025-09-30",
      },
      {
        id: "8-2",
        title: "Blockchain Workshop",
        teaser: "Learn blockchain technology.",
        image: Images.AfricachicksAd2,
        description: "Join our free blockchain workshop for businesses in Johannesburg.",
        validUntil: "2025-08-31",
      }
    ],
    socialLinks: [
      {
        name: "Website",
        icon: "globe",
        color: "#60A5FA",
        url: 'https://company.com/'
      },
      {
        name: "LinkedIn",
        icon: "linkedin",
        color: "#0077B5",
        url: 'https://linkedin.com'
      },
      {
        name: "Twitter",
        icon: "twitter",
        color: "#1DA1F2",
        url: 'https://twitter.com'
      },
      {
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        url: 'https://facebook.com'
      },
      {
        name: "Instagram",
        icon: "instagram",
        color: "#C13584",
        url: 'https://instagram.com'
      }
    ]
  }
];