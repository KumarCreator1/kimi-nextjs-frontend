import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// Create an axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Crucial for sending and receiving HttpOnly cookies (accessToken, refreshToken)
  withCredentials: true,
});

// Add a response interceptor to normalize error handling
api.interceptors.response.use(
  (response) => response.data, // Simplify access to response.data
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

// API endpoints grouped by feature
export const authApi = {
  login: (credentials) => api.post("/user/login", credentials),

  register: (userData) => api.post("/user/register", userData),

  logout: () => api.post("/user/logout"),

  getCurrentUser: () => api.get("/user/me"),
};

// Profile page data — identity + enrolled classes.
// Call this ONLY from the /profile page, never from AuthContext.
export const profileApi = {
  getProfile: () => api.get("/user/profile"),
};

export const classApi = {
  getUserClasses: () => api.get("/class"),
  createClass: (classData) => api.post("/class", classData),
  getClassDetail: (classId) => api.get(`/class/${classId}`),
  updateClass: (classId, classData) =>
    api.patch(`/class/${classId}`, classData),
  deleteClass: (classId) => api.delete(`/class/${classId}`),
  addMember: (classId, email) =>
    api.post(`/class/${classId}/member`, { email }),
  removeMember: (classId, memberId) =>
    api.delete(`/class/${classId}/member/${memberId}`),
};

export const subjectApi = {
  createSubject: (classId, subjectData) => api.post(`/class/${classId}/subject`, subjectData),
  listSubjects: (classId) => api.get(`/class/${classId}/subject`),
  getSubjectDetail: (classId, subjectId) => api.get(`/class/${classId}/subject/${subjectId}`),
  updateSubject: (classId, subjectId, subjectData) => api.patch(`/class/${classId}/subject/${subjectId}`, subjectData),
  deleteSubject: (classId, subjectId) => api.delete(`/class/${classId}/subject/${subjectId}`)
};

export const documentApi = {
  uploadDocument: (classId, subjectId, data) => 
    api.post(`/class/${classId}/subject/${subjectId}/document`, data),
  listDocuments: (classId, subjectId) => 
    api.get(`/class/${classId}/subject/${subjectId}/document?subjectId=${subjectId}`),
  getDocumentDetail: (classId, subjectId, documentId) => 
    api.get(`/class/${classId}/subject/${subjectId}/document/${documentId}`),
  getDocumentViewData: (classId, subjectId, documentId) => 
    api.get(`/class/${classId}/subject/${subjectId}/document/${documentId}/view`),
  downloadDocument: (classId, subjectId, documentId) => 
    api.get(`/class/${classId}/subject/${subjectId}/document/${documentId}/download`),
  checkConversionStatus: (classId, subjectId, documentId) => 
    api.get(`/class/${classId}/subject/${subjectId}/document/${documentId}/sync`),
  enrichDocument: (classId, subjectId, documentId) => 
    api.post(`/class/${classId}/subject/${subjectId}/document/${documentId}/enrich`),
  deleteDocument: (classId, subjectId, documentId) =>
    api.delete(`/class/${classId}/subject/${subjectId}/document/${documentId}`),
};
