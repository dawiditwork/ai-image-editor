import { betterAuth } from 'better-auth';
import {env} from "process"
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: env.BETTER_AUTH_URL,
})