type AuthUser = {
  id: string;
  name: string;
  email: string;
  password: string | null;
  saltString: string | null;
  profilePhoto: string | null;
  imagekitFileId: string | null;
  isBlocked: boolean | null;
  createdAt: Date;
  updatedAt: Date;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
