import type { SpotifyTrack, SpotifyArtist, AudioFeatures, MusicAnalysis } from "@shared/schema";

export class MusicAnalyzer {
  analyzeMusicData(
    tracks: SpotifyTrack[],
    artists: SpotifyArtist[],
    audioFeatures: AudioFeatures[]
  ): MusicAnalysis {
    const currentYear = new Date().getFullYear();
    
    // Calculate sad songs percentage (low valence)
    const sadSongsCount = audioFeatures.filter(f => f.valence < 0.4).length;
    const sadSongsPercentage = Math.round((sadSongsCount / audioFeatures.length) * 100);
    
    // Calculate mainstream percentage (high popularity)
    const mainstreamCount = tracks.filter(t => t.popularity > 70).length;
    const mainStreamPercentage = Math.round((mainstreamCount / tracks.length) * 100);
    
    // Calculate nostalgia percentage (2010-2015)
    const nostalgiaCount = tracks.filter(t => {
      const year = new Date(t.album.release_date).getFullYear();
      return year >= 2010 && year <= 2015;
    }).length;
    const nostalgiaPercentage = Math.round((nostalgiaCount / tracks.length) * 100);
    
    // Find most repeated artist
    const artistCounts = new Map<string, number>();
    tracks.forEach(track => {
      track.artists.forEach(artist => {
        artistCounts.set(artist.name, (artistCounts.get(artist.name) || 0) + 1);
      });
    });
    
    const [repeatArtist, repeatArtistCount] = Array.from(artistCounts.entries())
      .sort(([,a], [,b]) => b - a)[0] || ['Unknown', 0];
    
    // Calculate average tempo
    const avgTempo = Math.round(
      audioFeatures.reduce((sum, f) => sum + f.tempo, 0) / audioFeatures.length
    );
    
    // Find oldest song
    const oldestSong = Math.min(
      ...tracks.map(t => new Date(t.album.release_date).getFullYear())
    );
    
    // Count unique artists
    const uniqueArtistsSet = new Set(tracks.flatMap(t => t.artists.map(a => a.id)));
    const uniqueArtists = uniqueArtistsSet.size;
    
    // Get dominant genres
    const genreCounts = new Map<string, number>();
    artists.forEach(artist => {
      artist.genres.forEach(genre => {
        genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
      });
    });
    
    const dominantGenres = Array.from(genreCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([genre]) => genre);
    
    // Calculate averages
    const averagePopularity = Math.round(
      tracks.reduce((sum, t) => sum + t.popularity, 0) / tracks.length
    );
    
    const averageValence = parseFloat(
      (audioFeatures.reduce((sum, f) => sum + f.valence, 0) / audioFeatures.length).toFixed(2)
    );
    
    return {
      sadSongsPercentage,
      mainStreamPercentage,
      nostalgiaPercentage,
      topArtistPlays: repeatArtistCount,
      oldestSong,
      avgTempo,
      uniqueArtists,
      dominantGenres,
      averagePopularity,
      averageValence,
      repeatArtist,
      repeatArtistCount
    };
  }
}

export const musicAnalyzer = new MusicAnalyzer();
