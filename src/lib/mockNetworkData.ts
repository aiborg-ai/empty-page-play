import type { NetworkContact, ExpertiseArea, CollaborationRecord } from '../types/network';

// Patent professional data pools for realistic generation
const FIRST_NAMES = [
  'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Daniel', 'Jennifer', 'Christopher', 'Lisa', 'Matthew',
  'Amanda', 'James', 'Michelle', 'Robert', 'Ashley', 'William', 'Stephanie', 'Joseph', 'Nicole', 'Thomas',
  'Elizabeth', 'Charles', 'Rebecca', 'Mark', 'Rachel', 'Kevin', 'Samantha', 'Steven', 'Amy', 'Brian',
  'Anna', 'Timothy', 'Laura', 'Jason', 'Melissa', 'Ryan', 'Katherine', 'Andrew', 'Angela', 'John',
  'Heather', 'Anthony', 'Christine', 'Eric', 'Kimberly', 'Jonathan', 'Carol', 'Benjamin', 'Patricia', 'Richard'
];

const LAST_NAMES = [
  'Chen', 'Rodriguez', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez',
  'Lopez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson',
  'Moore', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Adams',
  'Baker', 'Green', 'Evans', 'Turner', 'Gonzalez', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Phillips',
  'Campbell', 'Parker', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook'
];

const JOB_TITLES = [
  'Senior Patent Attorney', 'Patent Engineer', 'IP Counsel', 'Patent Agent', 'Patent Prosecutor',
  'Technology Transfer Manager', 'IP Strategy Director', 'Patent Analyst', 'Chief Patent Officer', 'R&D Director',
  'Innovation Manager', 'Patent Portfolio Manager', 'Licensing Manager', 'IP Operations Manager', 'Patent Examiner',
  'Senior Research Scientist', 'Technology Strategist', 'IP Paralegal', 'Prior Art Specialist', 'Freedom to Operate Analyst',
  'Patent Landscape Analyst', 'IP Due Diligence Manager', 'Patent Valuation Expert', 'Technical Writer', 'Innovation Consultant',
  'Patent Information Specialist', 'IP Litigation Support', 'Technology Scout', 'Patent Search Expert', 'IP Policy Analyst'
];

const COMPANIES = [
  'TechVenture Corp', 'Innovation Labs Inc', 'NextGen Patents LLC', 'Advanced IP Solutions', 'BioTech Innovations',
  'Quantum Research Institute', 'AI Patent Partners', 'Global IP Services', 'Future Tech Holdings', 'Patent Strategy Group',
  'Intellectual Property Firm', 'TechTransfer Associates', 'Innovation Partners', 'Patent Law Group', 'R&D Solutions',
  'Technology Patents Inc', 'IP Management Company', 'Patent Portfolio Partners', 'Innovation IP Services', 'TechPatent Solutions',
  'Biomedical Patents LLC', 'Software IP Group', 'Hardware Innovation Corp', 'Green Tech Patents', 'Pharmaceutical IP',
  'Automotive Patents Inc', 'Aerospace IP Solutions', 'Energy Innovation Labs', 'Healthcare Patents Group', 'Fintech IP Partners',
  'Gaming Patents LLC', 'Robotics Innovation Inc', 'IoT Patent Solutions', 'Blockchain IP Group', 'VR Patent Partners',
  'Clean Energy Patents', 'Nanotech IP Corp', 'Cybersecurity Patents', 'Medical Device IP', 'Agricultural Innovation',
  'Space Technology Patents', 'Renewable Energy IP', 'Smart City Patents', 'Wearable Tech IP', 'Drone Innovation Labs',
  '5G Patent Solutions', 'Edge Computing IP', 'Quantum Computing Patents', 'Neural Network IP', 'Gene Therapy Patents'
];

const LOCATIONS = [
  'San Francisco, CA', 'Boston, MA', 'New York, NY', 'Austin, TX', 'Seattle, WA',
  'Research Triangle, NC', 'Chicago, IL', 'Los Angeles, CA', 'Denver, CO', 'Atlanta, GA',
  'Washington, DC', 'Philadelphia, PA', 'San Diego, CA', 'Phoenix, AZ', 'Dallas, TX',
  'Portland, OR', 'Minneapolis, MN', 'Tampa, FL', 'Detroit, MI', 'Columbus, OH',
  'London, UK', 'Toronto, Canada', 'Munich, Germany', 'Tokyo, Japan', 'Singapore',
  'Tel Aviv, Israel', 'Stockholm, Sweden', 'Zurich, Switzerland', 'Amsterdam, Netherlands', 'Paris, France'
];

const EXPERTISE_CATEGORIES = {
  technical: [
    'Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'Natural Language Processing',
    'Robotics', 'Internet of Things', 'Cloud Computing', 'Edge Computing', 'Blockchain Technology',
    'Quantum Computing', 'Cybersecurity', 'Software Engineering', 'Data Science', 'Big Data Analytics',
    'Mobile Technology', 'Web Development', 'Database Systems', 'Network Security', 'DevOps',
    'Biotechnology', 'Bioinformatics', 'Genetics', 'Molecular Biology', 'Synthetic Biology',
    'Medical Devices', 'Pharmaceuticals', 'Diagnostic Tools', 'Therapeutics', 'Drug Discovery',
    'Nanotechnology', 'Materials Science', 'Chemical Engineering', 'Mechanical Engineering', 'Electrical Engineering',
    'Renewable Energy', 'Energy Storage', 'Solar Technology', 'Wind Energy', 'Battery Technology',
    'Automotive', 'Aerospace', 'Manufacturing', 'Industrial Automation', 'Smart Sensors'
  ],
  industry: [
    'Healthcare', 'Finance', 'Automotive', 'Aerospace', 'Telecommunications', 'Energy',
    'Manufacturing', 'Agriculture', 'Entertainment', 'Gaming', 'Education', 'Retail',
    'Real Estate', 'Transportation', 'Logistics', 'Food & Beverage', 'Fashion',
    'Sports & Recreation', 'Travel & Tourism', 'Insurance', 'Banking', 'Consulting'
  ],
  legal: [
    'Patent Prosecution', 'Patent Litigation', 'IP Strategy', 'Patent Portfolio Management',
    'Freedom to Operate Analysis', 'Prior Art Search', 'Patent Valuation', 'IP Due Diligence',
    'Licensing Negotiations', 'Technology Transfer', 'Trademark Law', 'Copyright Law',
    'Trade Secret Protection', 'International IP Law', 'Patent Appeals', 'IP Enforcement'
  ],
  business: [
    'Innovation Strategy', 'Technology Commercialization', 'Venture Capital', 'Startup Advisory',
    'Business Development', 'Product Management', 'Market Research', 'Competitive Intelligence',
    'Strategic Planning', 'Corporate Development', 'Partnerships', 'Acquisitions'
  ]
};

// const PATENT_CATEGORIES = [
//   'Computer Technology', 'Digital Communication', 'Electrical Machinery', 'Audio Visual Technology',
//   'Telecommunications', 'IT Methods for Management', 'Semiconductors', 'Medical Technology',
//   'Organic Fine Chemistry', 'Biotechnology', 'Pharmaceuticals', 'Chemical Engineering',
//   'Materials Chemistry', 'Food Chemistry', 'Basic Materials Chemistry', 'Macromolecular Chemistry',
//   'Mechanical Elements', 'Transport', 'Machine Tools', 'Engines Pumps Turbines',
//   'Textile Paper Machines', 'Other Special Machines', 'Thermal Processes', 'Mechanical Engineering',
//   'Environmental Technology', 'Handling', 'Civil Engineering', 'Furniture Games',
//   'Other Consumer Goods', 'Measurement', 'Analysis of Biological Materials', 'Control',
//   'Medical Technology', 'Optics', 'Basic Communication', 'Computer Technology'
// ];

const UNIVERSITIES = [
  'MIT', 'Stanford University', 'Harvard University', 'UC Berkeley', 'Caltech',
  'Carnegie Mellon University', 'University of Washington', 'Georgia Tech', 'University of Texas at Austin',
  'University of Illinois', 'Purdue University', 'University of Michigan', 'Cornell University',
  'Princeton University', 'Yale University', 'Columbia University', 'University of Pennsylvania',
  'Northwestern University', 'University of Southern California', 'Duke University'
];

const DEGREES = [
  'B.S. Computer Science', 'B.S. Electrical Engineering', 'B.S. Mechanical Engineering',
  'B.S. Chemical Engineering', 'B.S. Bioengineering', 'B.S. Materials Science',
  'M.S. Computer Science', 'M.S. Electrical Engineering', 'M.S. Bioengineering',
  'Ph.D. Computer Science', 'Ph.D. Electrical Engineering', 'Ph.D. Chemistry',
  'Ph.D. Physics', 'Ph.D. Biology', 'J.D. Law', 'M.B.A. Business Administration'
];

/**
 * Generate a random expertise area
 */
function generateExpertiseArea(): ExpertiseArea {
  const categories = Object.keys(EXPERTISE_CATEGORIES);
  const category = categories[Math.floor(Math.random() * categories.length)] as keyof typeof EXPERTISE_CATEGORIES;
  const areas = EXPERTISE_CATEGORIES[category];
  const area = areas[Math.floor(Math.random() * areas.length)];

  return {
    id: `expertise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: area,
    category,
    proficiency_level: 60 + Math.floor(Math.random() * 40), // 60-100
    years_experience: 2 + Math.floor(Math.random() * 18), // 2-20 years
    patent_count: Math.floor(Math.random() * 25) + 1 // 1-25 patents
  };
}

/**
 * Generate collaboration records
 */
function generateCollaborationRecords(numRecords: number = 3): CollaborationRecord[] {
  const projectTypes: Array<'patent_application' | 'research' | 'prior_art' | 'licensing' | 'litigation'> = 
    ['patent_application', 'research', 'prior_art', 'licensing', 'litigation'];
  
  const records: CollaborationRecord[] = [];
  
  for (let i = 0; i < numRecords; i++) {
    const startDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 3); // Last 3 years
    const endDate = Math.random() > 0.3 ? 
      new Date(startDate.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000) : 
      undefined; // 30% still active

    records.push({
      id: `collab_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
      project_name: `Innovation Project ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 1000)}`,
      project_type: projectTypes[Math.floor(Math.random() * projectTypes.length)],
      collaborator_ids: [], // Will be filled later
      start_date: startDate.toISOString(),
      end_date: endDate?.toISOString(),
      status: endDate ? 'completed' : (['active', 'paused'][Math.floor(Math.random() * 2)] as 'active' | 'paused'),
      success_rating: 3 + Math.floor(Math.random() * 3), // 3-5 stars
      patent_numbers: Math.random() > 0.5 ? [`US${10000000 + Math.floor(Math.random() * 1000000)}`] : undefined,
      outcome: endDate ? 'Successfully completed with patent filing' : 'In progress - showing promising results'
    });
  }
  
  return records;
}

/**
 * Generate education records
 */
function generateEducation(numRecords: number = 2): Array<{ institution: string; degree: string; field: string; graduation_year: number }> {
  const records = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < numRecords; i++) {
    const graduationYear = currentYear - 5 - Math.floor(Math.random() * 25); // 5-30 years ago
    
    records.push({
      institution: UNIVERSITIES[Math.floor(Math.random() * UNIVERSITIES.length)],
      degree: DEGREES[Math.floor(Math.random() * DEGREES.length)],
      field: EXPERTISE_CATEGORIES.technical[Math.floor(Math.random() * EXPERTISE_CATEGORIES.technical.length)],
      graduation_year: graduationYear
    });
  }
  
  return records.sort((a, b) => a.graduation_year - b.graduation_year);
}

/**
 * Generate notable patents
 */
function generateNotablePatents(count: number): Array<{ patent_number: string; title: string; publication_date: string; citation_count?: number }> {
  const patents = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < count; i++) {
    const year = currentYear - Math.floor(Math.random() * 10); // Last 10 years
    const patentNumber = `US${10000000 + Math.floor(Math.random() * 1000000)}`;
    
    const techArea = EXPERTISE_CATEGORIES.technical[Math.floor(Math.random() * EXPERTISE_CATEGORIES.technical.length)];
    const title = `Method and System for Enhanced ${techArea} Processing`;
    
    patents.push({
      patent_number: patentNumber,
      title,
      publication_date: `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      citation_count: Math.floor(Math.random() * 100) + 5
    });
  }
  
  return patents.sort((a, b) => new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime());
}

/**
 * Generate publications
 */
function generatePublications(count: number): Array<{ title: string; journal: string; publication_date: string; co_authors: string[] }> {
  const journals = [
    'Nature Biotechnology', 'Science', 'Cell', 'IEEE Transactions on Pattern Analysis',
    'Journal of Machine Learning Research', 'Nature Machine Intelligence',
    'ACM Computing Surveys', 'Nature Materials', 'Advanced Materials',
    'Chemical Reviews', 'Angewandte Chemie', 'Journal of the American Chemical Society'
  ];
  
  const publications = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < count; i++) {
    const year = currentYear - Math.floor(Math.random() * 8); // Last 8 years
    const techArea = EXPERTISE_CATEGORIES.technical[Math.floor(Math.random() * EXPERTISE_CATEGORIES.technical.length)];
    
    // Generate co-authors
    const coAuthors = [];
    const numCoAuthors = 2 + Math.floor(Math.random() * 6); // 2-7 co-authors
    for (let j = 0; j < numCoAuthors; j++) {
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      coAuthors.push(`${firstName} ${lastName}`);
    }
    
    publications.push({
      title: `Advances in ${techArea}: A Comprehensive Study`,
      journal: journals[Math.floor(Math.random() * journals.length)],
      publication_date: `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      co_authors: coAuthors
    });
  }
  
  return publications.sort((a, b) => new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime());
}

/**
 * Generate professional bio
 */
function generateBio(title: string, company: string, expertiseAreas: ExpertiseArea[], yearsExperience: number): string {
  const primaryExpertise = expertiseAreas.length > 0 ? expertiseAreas[0].name : 'technology innovation';
  const secondaryExpertise = expertiseAreas.length > 1 ? expertiseAreas[1].name : 'intellectual property';
  
  const bioTemplates = [
    `Experienced ${title.toLowerCase()} at ${company} with ${yearsExperience} years of expertise in ${primaryExpertise} and ${secondaryExpertise}. Passionate about driving innovation through strategic patent development and technology transfer.`,
    
    `${title} specializing in ${primaryExpertise} with deep knowledge in ${secondaryExpertise}. ${yearsExperience}+ years of experience helping organizations build robust IP portfolios and navigate complex technology landscapes.`,
    
    `Senior patent professional with ${yearsExperience} years of experience in ${primaryExpertise} and ${secondaryExpertise}. Currently at ${company}, focusing on breakthrough technologies and strategic IP positioning.`,
    
    `Innovation-focused ${title.toLowerCase()} passionate about ${primaryExpertise} and ${secondaryExpertise}. ${yearsExperience} years of experience in patent strategy, technology assessment, and collaborative R&D initiatives.`
  ];
  
  return bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
}

/**
 * Determine connection status based on relationship strength and activity
 */
function determineConnectionStatus(connectionStrength: number, collaborationPotential: number): NetworkContact['connection_status'] {
  if (connectionStrength >= 80 && collaborationPotential >= 80) {
    return 'close_collaborator';
  } else if (connectionStrength >= 60) {
    return 'connected';
  } else if (Math.random() < 0.3) {
    return Math.random() < 0.5 ? 'invitation_sent' : 'invitation_received';
  } else {
    return 'known_connection';
  }
}

/**
 * Generate a single network contact
 */
export function generateNetworkContact(userId: string, index: number): NetworkContact {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const displayName = `${firstName} ${lastName}`;
  const title = JOB_TITLES[Math.floor(Math.random() * JOB_TITLES.length)];
  const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  
  const yearsExperience = 3 + Math.floor(Math.random() * 20); // 3-23 years
  
  // Generate expertise areas (2-5 areas per person)
  const numExpertiseAreas = 2 + Math.floor(Math.random() * 4);
  const expertiseAreas: ExpertiseArea[] = [];
  const usedAreas = new Set<string>();
  
  for (let i = 0; i < numExpertiseAreas; i++) {
    let area;
    do {
      area = generateExpertiseArea();
    } while (usedAreas.has(area.name));
    
    usedAreas.add(area.name);
    expertiseAreas.push(area);
  }
  
  // Calculate scores
  const innovationScore = 40 + Math.floor(Math.random() * 60); // 40-100
  const collaborationPotential = 30 + Math.floor(Math.random() * 70); // 30-100
  const connectionStrength = 20 + Math.floor(Math.random() * 80); // 20-100
  
  // Patent profile
  const totalPatents = Math.floor(Math.random() * 50) + 5; // 5-55 patents
  const asInventor = Math.floor(totalPatents * (0.6 + Math.random() * 0.4)); // 60-100% as inventor
  const asAssignee = totalPatents - asInventor;
  const recentPublications = Math.floor(Math.random() * 8) + 1; // 1-8 recent
  const hIndex = Math.floor(Math.random() * 30) + 5; // 5-35
  const citationCount = Math.floor(Math.random() * 1000) + 100; // 100-1100
  
  const notablePatents = generateNotablePatents(Math.min(3, Math.floor(totalPatents * 0.2)));
  
  // Generate other data
  const education = generateEducation(1 + Math.floor(Math.random() * 3));
  const publications = generatePublications(Math.floor(Math.random() * 5) + 1);
  const collaborationHistory = generateCollaborationRecords(Math.floor(Math.random() * 4) + 1);
  const bio = generateBio(title, company, expertiseAreas, yearsExperience);
  
  // Determine connection details
  const connectionStatus = determineConnectionStatus(connectionStrength, collaborationPotential);
  const lastInteraction = Math.random() < 0.7 ? 
    new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() : // Last 90 days
    undefined;
  
  const interactionFrequencies: Array<'daily' | 'weekly' | 'monthly' | 'rarely' | 'never'> = 
    ['daily', 'weekly', 'monthly', 'rarely', 'never'];
  const frequencyWeights = connectionStatus === 'close_collaborator' ? [0.1, 0.4, 0.3, 0.15, 0.05] :
                          connectionStatus === 'connected' ? [0.02, 0.15, 0.4, 0.35, 0.08] :
                          [0, 0.05, 0.15, 0.5, 0.3];
  
  let cumulativeWeight = 0;
  const rand = Math.random();
  let interactionFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely' | 'never' = 'rarely';
  
  for (let i = 0; i < frequencyWeights.length; i++) {
    cumulativeWeight += frequencyWeights[i];
    if (rand <= cumulativeWeight) {
      interactionFrequency = interactionFrequencies[i];
      break;
    }
  }
  
  return {
    id: `contact_${userId}_${index}_${Date.now()}`,
    user_id: userId,
    contact_user_id: undefined, // These are external contacts
    
    // Basic Information
    first_name: firstName,
    last_name: lastName,
    display_name: displayName,
    title,
    company,
    department: Math.random() < 0.6 ? `${expertiseAreas[0]?.category || 'Technology'} Division` : undefined,
    division: Math.random() < 0.4 ? 'R&D' : undefined,
    location,
    timezone: location.includes('CA') || location.includes('WA') || location.includes('OR') ? 'America/Los_Angeles' :
              location.includes('NY') || location.includes('MA') || location.includes('DC') ? 'America/New_York' :
              location.includes('TX') || location.includes('CO') ? 'America/Chicago' : 'America/New_York',
    
    // Contact Information
    email,
    phone: Math.random() < 0.7 ? `+1${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 9000) + 1000}` : undefined,
    linkedin_url: Math.random() < 0.8 ? `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 1000)}` : undefined,
    company_website: `https://${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    personal_website: Math.random() < 0.3 ? `https://${firstName.toLowerCase()}${lastName.toLowerCase()}.com` : undefined,
    
    // Professional Profile
    bio,
    profile_image: undefined, // Would be populated with actual image URLs in production
    years_experience: yearsExperience,
    education,
    
    // Expertise and Patents
    expertise_areas: expertiseAreas,
    patent_profile: {
      total_patents: totalPatents,
      as_inventor: asInventor,
      as_assignee: asAssignee,
      recent_publications: recentPublications,
      h_index: hIndex,
      citation_count: citationCount,
      top_patent_categories: expertiseAreas.slice(0, 3).map(e => e.name),
      notable_patents: notablePatents
    },
    publications,
    
    // Network Relationship
    connection_status: connectionStatus,
    connection_strength: connectionStrength,
    connection_date: connectionStatus === 'connected' || connectionStatus === 'close_collaborator' ? 
      new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 2).toISOString() : // Last 2 years
      undefined,
    connection_source: ['manual', 'imported', 'recommendation', 'event', 'mutual_connection'][Math.floor(Math.random() * 5)] as any,
    
    // Innovation Metrics
    innovation_score: innovationScore,
    collaboration_potential: collaborationPotential,
    response_rate: 60 + Math.floor(Math.random() * 35), // 60-95%
    collaboration_success_rate: 70 + Math.floor(Math.random() * 25), // 70-95%
    
    // Activity and Engagement
    last_interaction: lastInteraction,
    interaction_frequency: interactionFrequency,
    mutual_connections: Math.floor(Math.random() * 20) + 1, // 1-20
    shared_projects: Math.random() < 0.4 ? [`Project Alpha ${Math.floor(Math.random() * 1000)}`] : [],
    shared_expertise_areas: expertiseAreas.slice(0, 2).map(e => e.name),
    
    // Collaboration History
    collaboration_history: collaborationHistory,
    
    // System Fields
    created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(), // Last year
    updated_at: new Date().toISOString(),
    is_verified: Math.random() < 0.6, // 60% verified
    is_active: true,
    notes: Math.random() < 0.3 ? `Met at Innovation Conference ${2020 + Math.floor(Math.random() * 4)}. Excellent expertise in ${expertiseAreas[0]?.name || 'technology'}.` : undefined
  };
}

/**
 * Generate a complete network of 50 contacts for a user
 */
export function generateMockNetwork(userId: string): NetworkContact[] {
  console.log('🏭 Generating mock network of 50 patent professionals...');
  
  const contacts: NetworkContact[] = [];
  
  for (let i = 0; i < 50; i++) {
    const contact = generateNetworkContact(userId, i);
    contacts.push(contact);
  }
  
  // Ensure good distribution of connection statuses
  const statusCounts = {
    close_collaborator: Math.floor(contacts.length * 0.15), // 15%
    connected: Math.floor(contacts.length * 0.35), // 35%
    known_connection: Math.floor(contacts.length * 0.35), // 35%
    invitation_sent: Math.floor(contacts.length * 0.08), // 8%
    invitation_received: Math.floor(contacts.length * 0.07) // 7%
  };
  
  let index = 0;
  Object.entries(statusCounts).forEach(([status, count]) => {
    for (let i = 0; i < count && index < contacts.length; i++, index++) {
      contacts[index].connection_status = status as NetworkContact['connection_status'];
      
      // Adjust connection strength based on status
      if (status === 'close_collaborator') {
        contacts[index].connection_strength = 80 + Math.floor(Math.random() * 20); // 80-100
        contacts[index].collaboration_potential = 75 + Math.floor(Math.random() * 25); // 75-100
      } else if (status === 'connected') {
        contacts[index].connection_strength = 60 + Math.floor(Math.random() * 30); // 60-90
      }
    }
  });
  
  // Sort by collaboration potential (highest first)
  contacts.sort((a, b) => b.collaboration_potential - a.collaboration_potential);
  
  console.log('✅ Generated network with distribution:', {
    close_collaborator: contacts.filter(c => c.connection_status === 'close_collaborator').length,
    connected: contacts.filter(c => c.connection_status === 'connected').length,
    known_connection: contacts.filter(c => c.connection_status === 'known_connection').length,
    invitation_sent: contacts.filter(c => c.connection_status === 'invitation_sent').length,
    invitation_received: contacts.filter(c => c.connection_status === 'invitation_received').length
  });
  
  return contacts;
}

/**
 * Save mock network to localStorage for demo purposes
 */
export function saveMockNetworkToLocalStorage(userId: string): NetworkContact[] {
  const contacts = generateMockNetwork(userId);
  localStorage.setItem(`network_contacts_${userId}`, JSON.stringify(contacts));
  console.log(`📱 Mock network saved to localStorage for user: ${userId}`);
  return contacts;
}