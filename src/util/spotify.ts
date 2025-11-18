let accessToken = '';
const redirectURI = 'https://guessmytunes.com';
const clientId = process.env.REACT_APP_CLIENT_ID;

// Generate code verifier and challenge for PKCE
function generateRandomString(length: number) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

async function sha256(plain: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

function base64encode(input: ArrayBuffer) {
    return btoa(String.fromCharCode(...Array.from(new Uint8Array(input))))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

const Spotify = {

    async getAccessToken() {
        if(accessToken) {
            return accessToken;
        }

        // Check if we're returning from Spotify with a code
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
            // Exchange code for access token
            const codeVerifier = localStorage.getItem('code_verifier');
            
            if (!codeVerifier) {
                console.error('Code verifier not found');
                return;
            }

            const payload = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: clientId!,
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: redirectURI,
                    code_verifier: codeVerifier,
                }),
            };

            const response = await fetch('https://accounts.spotify.com/api/token', payload);
            const data = await response.json();

            if (data.access_token) {
                accessToken = data.access_token;
                const expiresIn = data.expires_in;
                
                // Clean up
                localStorage.removeItem('code_verifier');
                window.history.replaceState({}, '', '/');
                
                // Set expiration
                window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
                
                return accessToken;
            }
        } else {
            // Start authorization flow
            const codeVerifier = generateRandomString(64);
            const hashed = await sha256(codeVerifier);
            const codeChallenge = base64encode(hashed);
            
            // Store code verifier for later
            localStorage.setItem('code_verifier', codeVerifier);

            const scope = 'user-top-read';
            const authUrl = new URL("https://accounts.spotify.com/authorize");

            const params = {
                response_type: 'code',
                client_id: clientId!,
                scope,
                code_challenge_method: 'S256',
                code_challenge: codeChallenge,
                redirect_uri: redirectURI,
            };

            authUrl.search = new URLSearchParams(params).toString();
            window.location.href = authUrl.toString();
        }
    },

    checkAccessToken() {
        return !!accessToken;
    },

    async getUserInfo() {
        const token = await Spotify.getAccessToken();
        if (!token) return;
        
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    async getTop(type: string, range: string) {
        const token = await Spotify.getAccessToken();
        if (!token) return [];
        
        const response = await fetch(
            `https://api.spotify.com/v1/me/top/${type}?time_range=${range}&limit=10`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        
        const jsonResponse = await response.json();
        
        if(!jsonResponse.items || jsonResponse.items.length === 0) {
            console.log('No tracks found');
            return [];
        }

        if(type === 'tracks') {
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
}

export default Spotify;