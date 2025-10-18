import apiClient from './api.config';
import {
  EmployeeProfile,
  ApiResponse,
} from '../types/api.types';

class ProfileService {
  private basePath = '/employee/profile';

  /**
   * Get employee profile
   */
  async getProfile(): Promise<EmployeeProfile> {
    try {
      const response = await apiClient.get<ApiResponse<EmployeeProfile>>(
        this.basePath
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update profile (if API exists)
   */
  async updateProfile(data: Partial<EmployeeProfile>): Promise<EmployeeProfile> {
    try {
      const response = await apiClient.put<ApiResponse<EmployeeProfile>>(
        this.basePath,
        data
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload profile picture (if API exists)
   */
  async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post<ApiResponse<{ avatar_url: string }>>(
        `${this.basePath}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data.avatar_url;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: unknown): Error {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'An error occurred';
      return new Error(message);
    }
    return new Error('Network error. Please check your connection.');
  }
}

export default new ProfileService();
