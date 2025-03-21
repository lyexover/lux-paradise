import  NextAuth  from "next-auth";
import { authConfig } from "./auth.config";


export default NextAuth(authConfig).auth;

    export const config = {
        matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'] // Match all routes except /api, /_next/static, /_next/image, and .png files
      };
