export default function getSpotifyUris(tracks: any[]) {
  if (tracks instanceof Array) {
    const spotifyUris = tracks.map((item) => {
      return `spotify:track:${item.track.serviceId}`;
    });

    return spotifyUris;
  }
  return false;
}
