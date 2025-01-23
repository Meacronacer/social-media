import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace"; // Import the correct ExtendedError type
import cookie from "cookie";
import tokenService from "../services/token-service";

const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: ExtendedError) => void
): void => {
  try {
    // Attempt to retrieve the token from cookies
    const cookies = socket.handshake.headers.cookie;
    const accessToken = cookies ? cookie.parse(cookies)["accessToken"] : "";

    // Validate the token (JWT)
    const decoded = tokenService.validateAccessToken(accessToken);

    // Save user information to the socket object
    (socket as any).user = decoded;

    next(); // Proceed to the next middleware
  } catch (err) {
    console.error("Authentication error:", err);
    next(new Error("Invalid or expired token")); // Pass an error to the next function
  }
};

export default socketAuthMiddleware;
