import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile() {
    // TODO: return the decoded token
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }

  loggedIn() {
    // TODO: return a value that indicates if the user is logged in
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }
  
  isTokenExpired(token: string) {
    // TODO: return a value that indicates if the token is expired
    if (!token) return true; // If no token, consider it expired

    try {
      const decoded: JwtPayload = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp ? decoded.exp < currentTime : true;
    } catch (error) {
      return true; // If error decoding, assume token is expired
    }
  }

  getToken(): string | null {
    // TODO: return the token
    return localStorage.getItem("id_token");
  }

  login(idToken: string) {
    // TODO: set the token to localStorage
    // TODO: redirect to the home page
    localStorage.setItem('id_token', idToken);
    this.autoLogoutOnTokenExpiration();
    window.location.assign("/");
  }

  logout() {
    // TODO: remove the token from localStorage
    // TODO: redirect to the login page
    localStorage.removeItem('id_token');
    window.location.assign("/login");
  }

  autoLogoutOnTokenExpiration() {
      const token = this.getToken();
      if (!token) return;
  
      try {
        const decoded: JwtPayload = jwtDecode(token);
        const expirationTime = decoded.exp ? decoded.exp * 1000 : 0; // Convert to milliseconds
        const timeUntilExpiration = expirationTime - Date.now();
  
        if (timeUntilExpiration > 0) {
          setTimeout(() => {
            this.logout();
          }, timeUntilExpiration);
        } else {
          this.logout();
        }
      } catch (error) {
        console.error("Error decoding token for auto logout", error);
        this.logout();
      }
  }
}


export default new AuthService();
