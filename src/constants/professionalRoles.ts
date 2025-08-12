// Professional roles for IP professionals in the network

export interface ProfessionalRole {
  id: string;
  title: string;
  category: 'patent' | 'trademark' | 'legal' | 'management' | 'technical' | 'support';
  level?: 'executive' | 'senior' | 'mid' | 'junior' | 'trainee';
  abbreviation?: string;
}

export const PROFESSIONAL_ROLES: ProfessionalRole[] = [
  // Patent Professionals
  { id: 'patent-attorney-us', title: 'Patent Attorney (US: Patent Agent)', category: 'patent', level: 'senior' },
  { id: 'european-patent-attorney', title: 'European Patent Attorney (EPA)', category: 'patent', level: 'senior', abbreviation: 'EPA' },
  { id: 'chartered-patent-attorney', title: 'Chartered Patent Attorney (CPA/UK)', category: 'patent', level: 'senior', abbreviation: 'CPA' },
  { id: 'trainee-patent-attorney', title: 'Trainee Patent Attorney', category: 'patent', level: 'trainee' },
  { id: 'part-qualified-patent-attorney', title: 'Part-Qualified Patent Attorney', category: 'patent', level: 'junior' },
  { id: 'patent-counsel', title: 'Patent Counsel (In-house)', category: 'patent', level: 'senior' },
  { id: 'senior-patent-specialist', title: 'Senior Patent Specialist', category: 'patent', level: 'senior' },
  { id: 'patent-knowledge-lawyer', title: 'Patent Knowledge Lawyer', category: 'patent', level: 'senior' },
  
  // Trademark Professionals
  { id: 'trade-mark-attorney-uk', title: 'Trade Mark Attorney (UK/EU)', category: 'trademark', level: 'senior' },
  { id: 'trademark-attorney-us', title: 'Trademark Attorney (US)', category: 'trademark', level: 'senior' },
  { id: 'chartered-trade-mark-attorney', title: 'Chartered Trade Mark Attorney (CTMA)', category: 'trademark', level: 'senior', abbreviation: 'CTMA' },
  { id: 'trainee-trade-mark-attorney', title: 'Trainee Trade Mark Attorney', category: 'trademark', level: 'trainee' },
  { id: 'trade-mark-counsel', title: 'Trade Mark Counsel', category: 'trademark', level: 'senior' },
  { id: 'brand-protection-attorney', title: 'Brand Protection Attorney', category: 'trademark', level: 'mid' },
  
  // General IP Legal Roles
  { id: 'ip-solicitor', title: 'IP Solicitor', category: 'legal', level: 'senior' },
  { id: 'ip-barrister', title: 'IP Barrister', category: 'legal', level: 'senior' },
  { id: 'ip-litigator', title: 'IP Litigator', category: 'legal', level: 'senior' },
  { id: 'copyright-attorney', title: 'Copyright Attorney', category: 'legal', level: 'mid' },
  { id: 'intellectual-property-attorney', title: 'Intellectual Property Attorney', category: 'legal', level: 'senior' },
  { id: 'ip-legal-counsel', title: 'IP Legal Counsel (In-house)', category: 'legal', level: 'senior' },
  { id: 'ip-legal-director', title: 'IP Legal Director', category: 'legal', level: 'executive' },
  
  // Management & Strategy Roles - Executive Level
  { id: 'cipo', title: 'Chief Intellectual Property Officer (CIPO)', category: 'management', level: 'executive', abbreviation: 'CIPO' },
  { id: 'head-of-ip', title: 'Head of Intellectual Property', category: 'management', level: 'executive' },
  { id: 'director-of-ip', title: 'Director of Intellectual Property', category: 'management', level: 'executive' },
  { id: 'vp-ip', title: 'VP Intellectual Property', category: 'management', level: 'executive' },
  { id: 'ip-portfolio-director', title: 'IP Portfolio Director', category: 'management', level: 'executive' },
  
  // Management & Strategy Roles - Management Level
  { id: 'ip-manager', title: 'IP Manager', category: 'management', level: 'mid' },
  { id: 'patent-manager', title: 'Patent Manager', category: 'management', level: 'mid' },
  { id: 'trade-mark-manager', title: 'Trade Mark Manager', category: 'management', level: 'mid' },
  { id: 'ip-portfolio-manager', title: 'IP Portfolio Manager', category: 'management', level: 'mid' },
  { id: 'senior-ip-manager', title: 'Senior IP Manager', category: 'management', level: 'senior' },
  { id: 'ip-operations-manager', title: 'IP Operations Manager', category: 'management', level: 'mid' },
  { id: 'brand-protection-manager', title: 'Brand Protection Manager', category: 'management', level: 'mid' },
  
  // Technical & Analytical Roles - Patent Technical
  { id: 'patent-engineer', title: 'Patent Engineer', category: 'technical', level: 'mid' },
  { id: 'patent-analyst', title: 'Patent Analyst', category: 'technical', level: 'mid' },
  { id: 'patent-searcher', title: 'Patent Searcher', category: 'technical', level: 'mid' },
  { id: 'prior-art-searcher', title: 'Prior Art Searcher', category: 'technical', level: 'mid' },
  { id: 'patent-examiner', title: 'Patent Examiner (Government)', category: 'technical', level: 'mid' },
  { id: 'patent-specialist', title: 'Patent Specialist', category: 'technical', level: 'mid' },
  { id: 'technical-specialist-patents', title: 'Technical Specialist - Patents', category: 'technical', level: 'mid' },
  
  // Technical & Analytical Roles - Analytics & Research
  { id: 'ip-analyst', title: 'IP Analyst', category: 'technical', level: 'mid' },
  { id: 'competitive-intelligence-analyst', title: 'Competitive Intelligence Analyst', category: 'technical', level: 'mid' },
  { id: 'patent-analytics-specialist', title: 'Patent Analytics Specialist', category: 'technical', level: 'mid' },
  { id: 'ip-research-analyst', title: 'IP Research Analyst', category: 'technical', level: 'mid' },
  { id: 'fto-analyst', title: 'Freedom to Operate Analyst', category: 'technical', level: 'senior' },
  { id: 'patent-landscape-analyst', title: 'Patent Landscape Analyst', category: 'technical', level: 'mid' },
  
  // Support & Administrative Roles
  { id: 'patent-paralegal', title: 'Patent Paralegal', category: 'support', level: 'junior' },
  { id: 'trade-mark-paralegal', title: 'Trade Mark Paralegal', category: 'support', level: 'junior' },
  { id: 'ip-paralegal', title: 'IP Paralegal', category: 'support', level: 'junior' },
  { id: 'patent-administrator', title: 'Patent Administrator', category: 'support', level: 'junior' },
  { id: 'trade-mark-administrator', title: 'Trade Mark Administrator', category: 'support', level: 'junior' },
  { id: 'ip-administrator', title: 'IP Administrator', category: 'support', level: 'junior' },
  { id: 'formalities-officer', title: 'Formalities Officer', category: 'support', level: 'junior' },
  { id: 'renewals-specialist', title: 'Renewals Specialist', category: 'support', level: 'junior' },
];

// Categories for filtering
export const ROLE_CATEGORIES = [
  { id: 'all', label: 'All Roles', icon: 'Users' },
  { id: 'patent', label: 'Patent Professionals', icon: 'FileText', color: 'blue' },
  { id: 'trademark', label: 'Trademark Professionals', icon: 'Award', color: 'purple' },
  { id: 'legal', label: 'IP Legal', icon: 'Scale', color: 'red' },
  { id: 'management', label: 'IP Management', icon: 'Briefcase', color: 'green' },
  { id: 'technical', label: 'Technical & Analytics', icon: 'ChartBar', color: 'orange' },
  { id: 'support', label: 'Support & Admin', icon: 'UserCheck', color: 'gray' },
];

// Role levels for additional filtering
export const ROLE_LEVELS = [
  { id: 'all', label: 'All Levels' },
  { id: 'executive', label: 'Executive', color: 'purple' },
  { id: 'senior', label: 'Senior', color: 'blue' },
  { id: 'mid', label: 'Mid-Level', color: 'green' },
  { id: 'junior', label: 'Junior', color: 'orange' },
  { id: 'trainee', label: 'Trainee', color: 'gray' },
];

// Helper function to get role by ID
export const getRoleById = (id: string): ProfessionalRole | undefined => {
  return PROFESSIONAL_ROLES.find(role => role.id === id);
};

// Helper function to get roles by category
export const getRolesByCategory = (category: string): ProfessionalRole[] => {
  if (category === 'all') return PROFESSIONAL_ROLES;
  return PROFESSIONAL_ROLES.filter(role => role.category === category);
};

// Helper function to get roles by level
export const getRolesByLevel = (level: string): ProfessionalRole[] => {
  if (level === 'all') return PROFESSIONAL_ROLES;
  return PROFESSIONAL_ROLES.filter(role => role.level === level);
};

// Helper function to search roles
export const searchRoles = (query: string): ProfessionalRole[] => {
  const lowercaseQuery = query.toLowerCase();
  return PROFESSIONAL_ROLES.filter(role => 
    role.title.toLowerCase().includes(lowercaseQuery) ||
    role.category.includes(lowercaseQuery) ||
    (role.abbreviation && role.abbreviation.toLowerCase().includes(lowercaseQuery))
  );
};