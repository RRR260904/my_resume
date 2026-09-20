import axios from 'axios';
import { PortfolioData, Project, AdminStats } from '../types';

const apiBase = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : '/api';

const apiClient = axios.create({
  baseURL: apiBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token for admin requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept 401 responses to auto-clear invalid/expired JWT
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url?.includes('/admin')) {
      localStorage.removeItem('portfolio_admin_token');
      localStorage.removeItem('portfolio_admin_user');
    }
    return Promise.reject(error);
  }
);

// ==========================================
// PUBLIC PORTFOLIO API CALLS
// ==========================================

export async function fetchPortfolioSummary(): Promise<PortfolioData> {
  const response = await apiClient.get<PortfolioData>('/portfolio-summary');
  return response.data;
}

export async function fetchProfile() {
  const response = await apiClient.get('/profile');
  return response.data;
}

export async function fetchAbout() {
  const response = await apiClient.get('/about');
  return response.data;
}

export async function fetchSkills() {
  const response = await apiClient.get('/skills');
  return response.data;
}

export async function fetchExperience() {
  const response = await apiClient.get('/experience');
  return response.data;
}

export async function fetchEducation() {
  const response = await apiClient.get('/education');
  return response.data;
}

export async function fetchProjects(): Promise<Project[]> {
  const response = await apiClient.get<Project[]>('/projects');
  return response.data;
}

export async function fetchProjectBySlug(slug: string): Promise<Project> {
  const response = await apiClient.get<Project>(`/projects/${slug}`);
  return response.data;
}

export async function fetchCertifications() {
  const response = await apiClient.get('/certifications');
  return response.data;
}

export async function fetchAchievements() {
  const response = await apiClient.get('/achievements');
  return response.data;
}

export async function fetchSocialLinks() {
  const response = await apiClient.get('/social-links');
  return response.data;
}

export async function fetchContactInfo() {
  const response = await apiClient.get('/contact');
  return response.data;
}

export async function submitContactMessage(data: { name: string; email: string; subject?: string; message: string }) {
  const response = await apiClient.post('/contact', data);
  return response.data;
}

export async function fetchSiteSettings() {
  const response = await apiClient.get('/settings');
  return response.data;
}

// ==========================================
// ADMIN API CALLS
// ==========================================

export async function adminLogin(username: string, password: string) {
  const response = await apiClient.post('/admin/login', { username, password });
  if (response.data.token) {
    localStorage.setItem('portfolio_admin_token', response.data.token);
    localStorage.setItem('portfolio_admin_user', JSON.stringify(response.data.admin));
  }
  return response.data;
}

export function getAdminUser() {
  const user = localStorage.getItem('portfolio_admin_user');
  return user ? JSON.parse(user) : null;
}

export function adminLogout() {
  localStorage.removeItem('portfolio_admin_token');
  localStorage.removeItem('portfolio_admin_user');
}

export async function verifyAdminToken(): Promise<boolean> {
  const token = localStorage.getItem('portfolio_admin_token');
  if (!token) return false;
  try {
    const res = await apiClient.get('/admin/verify');
    return !!res.data.valid;
  } catch {
    adminLogout();
    return false;
  }
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const response = await apiClient.get<AdminStats>('/admin/stats');
  return response.data;
}

export async function fetchAdminCollection(collectionName: string) {
  const response = await apiClient.get(`/admin/collections/${collectionName}`);
  return response.data;
}

export async function createAdminItem(collectionName: string, data: any) {
  const response = await apiClient.post(`/admin/collections/${collectionName}`, data);
  return response.data;
}

export async function updateAdminItem(collectionName: string, id: string, data: any) {
  const response = await apiClient.put(`/admin/collections/${collectionName}/${id}`, data);
  return response.data;
}

export async function deleteAdminItem(collectionName: string, id: string) {
  const response = await apiClient.delete(`/admin/collections/${collectionName}/${id}`);
  return response.data;
}

export async function reorderAdminItems(collectionName: string, items: { id: string; display_order: number }[]) {
  const response = await apiClient.post(`/admin/collections/${collectionName}/reorder`, { items });
  return response.data;
}

export async function seedDatabase() {
  const response = await apiClient.post('/admin/seed');
  return response.data;
}

export async function feedAtlasDatabaseApi(uri?: string) {
  const response = await apiClient.post('/admin/feed-atlas', { uri });
  return response.data;
}

export async function wipeDatabase() {
  const response = await apiClient.post('/admin/wipe');
  return response.data;
}

export default apiClient;
