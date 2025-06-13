import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import queryString from "query-string";

@Injectable()
export class SpotifyService {
    // These are the required scopes for our application
    private readonly scopes = [
        'user-read-email',           // Read user's email
        'user-read-private',         // Read user's private information
        'playlist-read-private',     // Read private playlists
        'playlist-read-collaborative', // Read collaborative playlists
        'playlist-modify-public',    // Create/modify public playlists
        'playlist-modify-private',   // Create/modify private playlists
    ];

    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
    ) { }

    /**
     * Challenge 1: Implement the getAuthUrl method
     * 
     * This method should:
     * 1. Get the client ID and redirect URI from config
     * 2. Create a URLSearchParams object with:
     *    - client_id
     *    - response_type: 'code'
     *    - redirect_uri
     *    - scope: joined scopes array
     *    - show_dialog: 'true'
     * 3. Return the full Spotify authorization URL
     * 
     * Example URL structure:
     * https://accounts.spotify.com/authorize?client_id=...&response_type=code&redirect_uri=...&scope=...&show_dialog=true
     */
    async getAuthUrl(): Promise<string> {
        const clientId = this.config.get<string>('SPOTIFY_CLIENT_ID');
        const redirectURI = this.config.get<string>('SPOTIFY_REDIRECT_URI');

        const authUrl = ("https://accounts.spotify.com/authorize?" + queryString.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: this.scopes,
            redirect_uri: redirectURI,
        }))

        return authUrl;
    }

    /**
     * Challenge 2: Implement the exchangeCodeForTokens method
     * 
     * This method should:
     * 1. Get client ID and secret from config
     * 2. Create a POST request to https://accounts.spotify.com/api/token with:
     *    - grant_type: 'authorization_code'
     *    - code: the authorization code
     *    - redirect_uri: from config
     * 3. Use Basic Auth with client_id:client_secret
     * 4. Return the response which should include:
     *    - access_token
     *    - refresh_token
     *    - expires_in
     */
    private async exchangeCodeForTokens(code: string) {
        const clientId = this.config.get<string>('SPOTIFY_CLIENT_ID');
        const clientSecret = this.config.get<string>('SPOTIFY_CLIENT_SECRET');
    }

    /**
     * Challenge 3: Implement the getUserProfile method
     * 
     * This method should:
     * 1. Make a GET request to https://api.spotify.com/v1/me
     * 2. Use the access token in the Authorization header
     * 3. Return the user profile data
     */
    private async getUserProfile(accessToken: string) {
        // TODO: Implement this method
        throw new Error('Not implemented');
    }

    /**
     * Challenge 4: Implement the handleCallback method
     * 
     * This method should:
     * 1. Exchange the code for tokens using exchangeCodeForTokens
     * 2. Get the user profile using getUserProfile
     * 3. Store or update the service connection in the database
     * 4. Return the user profile and success status
     */
    async handleCallback(code: string, userId: string) {
        // TODO: Implement this method
        throw new Error('Not implemented');
    }
}