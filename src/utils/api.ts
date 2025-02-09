
const API_BASE_URL = 'https://your-heroku-app.herokuapp.com/api';  // Replace with your Heroku URL

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ProfileData {
  about: string;
  skills: string;
  background: string;
  interests: string;
  linkedinUrl: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  dateOfBirth: string;
}

export const signUp = async (data: SignUpData) => {
  const response = await fetch(`${API_BASE_URL}/signup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Signup failed');
  }

  return response.json();
};

export const completeProfile = async (profileData: ProfileData, token: string) => {
  const response = await fetch(`${API_BASE_URL}/complete-profile/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error('Profile completion failed');
  }

  return response.json();
};
