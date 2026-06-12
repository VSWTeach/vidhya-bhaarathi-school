const API_BASE_URL = 'http://localhost:8000/api';

const getAuthToken = () => localStorage.getItem('access_token');

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('admin');
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  return response.json();
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },
  
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  
  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }
};
