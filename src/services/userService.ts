import * as ImagePicker from "expo-image-picker";
import type { User } from "../types/auth";
import api from "./api";
import { API_BASE_URL } from "../config/api";
import { storage, StorageKeys } from "../utils/storage";

export const userService = {
  /**
   * Get the currently authenticated user's profile
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<{ user: User }>("/users/me");
    return response.data.user;
  },

  /**
   * Update the authenticated user's full_name
   */
  updateProfile: async (fullName: string): Promise<User> => {
    const response = await api.patch<{ user: User }>("/users/me", {
      full_name: fullName,
    });
    return response.data.user;
  },

  /**
   * Upload a new avatar image
   * Uses expo-image-picker to select image, then uploads via multipart/form-data
   */
  uploadAvatar: async (imageResult: ImagePicker.ImagePickerResult): Promise<User | null> => {
    if (imageResult.canceled || !imageResult.assets?.length) {
      return null;
    }

    const image = imageResult.assets[0];

    const formData = new FormData();
    formData.append("avatar", {
      uri: image.uri,
      type: image.mimeType || "image/jpeg",
      name: image.fileName || "avatar.jpg",
    } as any);

    // Get token manually since we need to set custom headers
    const token = await storage.getItem(StorageKeys.USER_TOKEN);

    const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        // DO NOT set Content-Type — fetch sets it automatically with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.user;
  },

  /**
   * Pick an image from the device library
   */
  pickImage: async (): Promise<ImagePicker.ImagePickerResult> => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      throw new Error("Permission to access photos was denied");
    }

    return await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
  },

  /**
   * Soft-delete the authenticated user's account
   * Sets status to "deleted" and revokes all refresh tokens
   */
  deleteAccount: async (): Promise<void> => {
    await api.delete("/users/me");
  },
};

export default userService;
