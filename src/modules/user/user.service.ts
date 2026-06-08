import { deleteProfilePhoto, uploadProfilePhoto } from "../../utils/upload-photo.ts";
import { UserRepository } from "./user.repository.ts";

type UpdateUserInput = {
  name?: string;
  photo?: Express.Multer.File;
};

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async getProfile(id: string) {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async updateUser(id: string, input: UpdateUserInput) {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new Error("User not found");
    }

    const updates: Partial<typeof user> = {};

    if (input.name) {
      updates.name = input.name;
    }

    if (input.photo) {
      const uploadedPhoto = await uploadProfilePhoto(input.photo, id);

      if (user.imagekitFileId) {
        await deleteProfilePhoto(user.imagekitFileId);
      }

      if (uploadedPhoto.profilePhoto) {
        updates.profilePhoto = uploadedPhoto.profilePhoto;
      }

      if (uploadedPhoto.imagekitFileId) {
        updates.imagekitFileId = uploadedPhoto.imagekitFileId;
      }
    }

    if (!input.name && !input.photo) {
      throw new Error("Nothing to update");
    }

    const updatedUser = await this.userRepository.updateUser(id, updates);

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return updatedUser;
  }

  async searchUsers(query: string) {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      throw new Error("Search query is required");
    }

    const users = await this.userRepository.searchUsers(trimmedQuery);
    return users;
  }
}
