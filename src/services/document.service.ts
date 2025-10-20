import apiClient from "./api.config";
import type { Document, PaginatedResponse } from "../types/api.types";

class DocumentService {
  private readonly BASE_PATH = "/employee/documents";

  /**
   * Get all documents
   */
  async getDocuments(params?: {
    category?: string;
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Document>> {
    const response = await apiClient.get<PaginatedResponse<Document>>(
      this.BASE_PATH,
      { params }
    );
    return response.data;
  }

  /**
   * Get single document by ID
   */
  async getDocument(id: number): Promise<Document> {
    const response = await apiClient.get<Document>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  /**
   * Download document
   */
  async downloadDocument(id: number): Promise<Blob> {
    const response = await apiClient.get<Blob>(
      `${this.BASE_PATH}/${id}/download`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  }

  /**
   * Upload document
   */
  async uploadDocument(formData: FormData): Promise<Document> {
    const response = await apiClient.post<Document>(this.BASE_PATH, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  /**
   * Delete document
   */
  async deleteDocument(id: number): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${id}`);
  }
}

export default new DocumentService();
