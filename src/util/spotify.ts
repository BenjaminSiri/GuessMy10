
let accessToken = '';
const redirectURI = 'http://localhost:3000/callback';

const Spotify = {

    getAccessToken() {
        if(accessToken) {
            return accessToken;
        }
        const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
        if(urlAccessToken && urlExpiresIn) {
            accessToken = urlAccessToken[1];
            const expiresIn = Number(urlExpiresIn[1]);
            window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
            window.history.pushState('Access Token', '', '/');
            return accessToken;
        } else {
            const auth = `https://accounts.spotify.com/authorize?show_dialog=true&client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=token&scope=user-top-read&redirect_uri=${redirectURI}`
            window.location.href = auth;
        }
    },

    checkAccessToken() {
        if(accessToken) {
            return true;
        }
        return false;
    },

    getUserInfo() {
        let accessToken = Spotify.getAccessToken();
        return fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${accessToken}`},
        })
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            return jsonResponse;
        })
    },

    getTop(type: string, range: string) {
        let accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${range}&limit=10`,{
            headers: { Authorization: `Bearer ${accessToken}`},

        })
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            if(jsonResponse.items.length === 0) {
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
        })
    },
}

export default Spotify;