# YouTube API Setup

YouTube integration has been successfully implemented using the YouTube Data API v3. To complete the setup, you need to configure the YouTube API credentials.

## Required Environment Variables

Add the following environment variables to your backend configuration:

```bash
# YouTube API Configuration
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:3000/music-services/youtube/callback
```

## Getting YouTube API Credentials

1. **Go to Google Cloud Console**

   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**

   - Create a new project or select an existing one

3. **Enable YouTube Data API v3**

   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

4. **Create OAuth2 Credentials**

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - For development: `http://localhost:3000/music-services/youtube/callback`
     - For production: `https://yourdomain.com/music-services/youtube/callback`

5. **Copy Credentials**
   - Copy the Client ID and Client Secret
   - Add them to your environment variables

## OAuth Scopes Used

The implementation uses the following YouTube API scopes:

- `https://www.googleapis.com/auth/youtube` - Full access to YouTube account
- `https://www.googleapis.com/auth/youtube.readonly` - Read-only access
- `https://www.googleapis.com/auth/youtube.force-ssl` - Force SSL connections

## API Endpoints

The following endpoints are now available:

### Authentication

- `GET /music-services/youtube/auth-url` - Get OAuth authorization URL
- `GET /music-services/youtube/callback` - Handle OAuth callback
- `POST /music-services/youtube/disconnect` - Disconnect service

### Playlists & Content

- `GET /music-services/youtube/test-connection` - Test service connection
- `GET /music-services/youtube/test-playlists` - Test playlist access
- `GET /music-services/youtube/search` - Search for videos/playlists
- `GET /music-services/youtube/recommendations` - Get recommendations

## Usage Flow

1. **User connects YouTube:**

   ```
   GET /music-services/youtube/auth-url
   → Returns authorization URL
   → User visits URL and authorizes
   → Redirected to callback endpoint
   → Service connection saved in database
   ```

2. **Access playlists and content:**
   ```
   All other endpoints require the user to be authenticated
   and have YouTube connected
   ```

## Implementation Details

- **Service Type**: `YOUTUBE`
- **Base Service**: Extends `BaseMusicService`
- **Module**: `YouTubeModule`
- **Registration**: Automatically registered in `MusicServicesModule`

## Database Schema

The integration uses the existing `ServiceConnection` table with:

- `serviceType`: `'YOUTUBE'`
- `accessToken`: YouTube OAuth access token
- `refreshToken`: YouTube OAuth refresh token
- `expiresAt`: Token expiration timestamp
- `serviceUserId`: YouTube channel ID

## Notes

- YouTube integration uses YouTube Data API v3
- Videos are treated as "tracks" in the music service interface
- Playlists work the same as other music services
- Recommendations are implemented using YouTube's search functionality
- All tokens are automatically refreshed when needed
