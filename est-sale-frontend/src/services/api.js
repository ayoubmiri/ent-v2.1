// Mock API service - replace with real API calls later
export const fetchNews = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 1,
      title: "Nouveau programme de génie logiciel",
      date: "15 Mars 2025",
      description: "Découvrez notre programme renouvelé avec des modules sur l'IA, le cloud computing et la cybersécurité.",
      image: "/assets/images/news1.jpg"
    },
    // More mock news
  ];
};

export const fetchPrograms = async () => {
  // Similar mock implementation
};

export const fetchEvents = async () => {
  // Similar mock implementation
};