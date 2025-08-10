export interface DemoUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  useType: 'trial' | 'non-commercial' | 'commercial';
  recordSearchHistory: boolean;
  registrationDate: string;
}

// Demo users database
const demoUsers: DemoUser[] = [
  {
    id: '1',
    email: 'demo@innospot.com',
    username: 'demo_user',
    firstName: 'Demo',
    lastName: 'User',
    useType: 'non-commercial',
    recordSearchHistory: true,
    registrationDate: '2024-12-01'
  },
  {
    id: '2',
    email: 'john.researcher@university.edu',
    username: 'john_researcher',
    firstName: 'John',
    lastName: 'Researcher',
    useType: 'non-commercial',
    recordSearchHistory: true,
    registrationDate: '2024-11-15'
  },
  {
    id: '3',
    email: 'sarah.analyst@company.com',
    username: 'sarah_analyst',
    firstName: 'Sarah',
    lastName: 'Analyst',
    useType: 'commercial',
    recordSearchHistory: false,
    registrationDate: '2024-10-20'
  }
];

// Demo passwords (in real app, these would be hashed)
const demoPasswords: Record<string, string> = {
  'demo@innospot.com': 'demo123456',
  'john.researcher@university.edu': 'research2024',
  'sarah.analyst@company.com': 'analyst123'
};

export class DemoAuthService {
  private static currentUser: DemoUser | null = null;

  static async login(email: string, password: string): Promise<{ success: boolean; user?: DemoUser; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const user = demoUsers.find(u => u.email === email);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (demoPasswords[email] !== password) {
      return { success: false, error: 'Invalid password' };
    }

    this.currentUser = user;
    localStorage.setItem('demoUser', JSON.stringify(user));
    
    return { success: true, user };
  }

  static async register(userData: {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    useType: 'trial' | 'non-commercial' | 'commercial';
    recordSearchHistory: boolean;
  }): Promise<{ success: boolean; user?: DemoUser; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if user already exists
    const existingUser = demoUsers.find(u => u.email === userData.email || u.username === userData.username);
    if (existingUser) {
      return { success: false, error: 'User already exists with this email or username' };
    }

    // Create new user
    const newUser: DemoUser = {
      id: (demoUsers.length + 1).toString(),
      email: userData.email,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      useType: userData.useType,
      recordSearchHistory: userData.recordSearchHistory,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    // Add to demo database
    demoUsers.push(newUser);
    demoPasswords[userData.email] = userData.password;

    this.currentUser = newUser;
    localStorage.setItem('demoUser', JSON.stringify(newUser));

    return { success: true, user: newUser };
  }

  static getCurrentUser(): DemoUser | null {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('demoUser');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    
    return null;
  }

  static logout(): void {
    this.currentUser = null;
    localStorage.removeItem('demoUser');
  }

  static getDemoCredentials(): { email: string; password: string }[] {
    return [
      { email: 'demo@innospot.com', password: 'demo123456' },
      { email: 'john.researcher@university.edu', password: 'research2024' },
      { email: 'sarah.analyst@company.com', password: 'analyst123' }
    ];
  }
}