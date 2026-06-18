type AuthUser = {
  password?: string | null;
  saltString?: string | null;
};

export function sanitizeUser<T extends AuthUser>(user: T) {
  const { password, saltString, ...safeUser } = user;
  return safeUser;
}
