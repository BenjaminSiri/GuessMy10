// spotify.ts

const clientId = process.env.REACT_APP_CLIENT_ID!;
const redirectUri = 'https://www.guessmytunes.com';

let accessToken = '';
let tokenExpirationTime = 0;

// PKCE helper functions
function generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

async function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

function base64encode(input: ArrayBuffer): string {
    return btoa(String.fromCharCode(...Array.from(new Uint8Array(input))))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

const Spotify = {
    // Step 1: Redirect to Spotify authorization
    async redirectToAuthCodeFlow() {
        const verifier = generateRandomString(64);
        const hashed = await sha256(verifier);
        const challenge = base64encode(hashed);

        // Store verifier in localStorage for when we return
        localStorage.setItem('verifier', verifier);

        const params = new URLSearchParams({
            client_id: clientId,
            response_type: 'code',
            redirect_uri: redirectUri,
            scope: 'user-top-read',
            code_challenge_method: 'S256',
            code_challenge: challenge,
        });

        window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
    },

    // Step 2: Exchange code for access token
    async getAccessToken(code: string): Promise<string> {
        const verifier = localStorage.getItem('verifier');

        if (!verifier) {
            throw new Error('Verifier not found');
        }

        const params = new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            code_verifier: verifier,
        });

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        const data = await result.json();
        
        if (data.access_token) {
            accessToken = data.access_token;
            tokenExpirationTime = Date.now() + (data.expires_in * 1000);
            localStorage.removeItem('verifier'); // Clean up
            return accessToken;
        } else {
            throw new Error('Failed to get access token');
        }
    },

    // Check if we have a valid token
    hasValidToken(): boolean {
        return !!accessToken && Date.now() < tokenExpirationTime;
    },

    // Get the current access token (or return empty string)
    getCurrentToken(): string {
        return this.hasValidToken() ? accessToken : '';
    },

    // Step 3: Fetch user profile
    async getUserInfo() {
        if (!this.hasValidToken()) {
            return null;
        }

        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        return response.json();
    },

    // Fetch top tracks or artists
    async getTop(type: 'tracks' | 'artists', range: string) {
        if (!this.hasValidToken()) {
            return [];
        }

        const response = await fetch(
            `https://api.spotify.com/v1/me/top/${type}?time_range=${range}&limit=10`,
            {
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        );

        if (!response.ok) {
            console.error('Failed to fetch top items');
            return [];
        }

        const jsonResponse = await response.json();

        if (!jsonResponse.items || jsonResponse.items.length === 0) {
            console.log('No items found');
            return [];
        }

        if (type === 'tracks') {
            return jsonResponse.items.map((track: any) => ({
                target: track.name,
                trackVisible: false,
                hint: track.artists[0].name,
                hintVisible: false
            }));
        } else {
            return jsonResponse.items.map((artist: any) => ({
                target: artist.name,
                trackVisible: false,
                hint: '',
                hintVisible: false
            }));
        }
    },
};

export default Spotify;