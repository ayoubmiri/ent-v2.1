export const auth = {
  async login(credentials) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response based on credentials
    if (credentials.email === 'etudiant@estsale.ma' && credentials.password === 'Etudiant123') {
      return {
        id: 'EST12345',
        nom: 'El Amrani',
        prenom: 'Ahmed',
        email: 'etudiant@estsale.ma',
        role: 'etudiant',
        token: 'mock-token-for-student'
      };
    } else if (credentials.email === 'enseignant@estsale.ma' && credentials.password === 'Enseignant123') {
      return {
        id: 'ENS78901',
        nom: 'Benali',
        prenom: 'Fatima',
        email: 'enseignant@estsale.ma',
        role: 'enseignant',
        token: 'mock-token-for-teacher'
      };
    }
    throw new Error('Invalid credentials');
  },

  async logout() {
    // Clear any stored tokens or session data
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  async checkAuth() {
    // Simulate checking auth status
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, you would check localStorage or cookies for a valid token
    return null; // Simulate logged out state initially
  }
};