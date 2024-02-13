export interface AuthenticationIRepository {
  createUser(user);
  authenticate(login);
  verifyToken(token);
}
