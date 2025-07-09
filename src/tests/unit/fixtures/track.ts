import { CreateTrackRequest, Track } from "@/types/track";

export const trackInputFixture: CreateTrackRequest = {
    title: 'Test Song',
    artist: 'Test Artist',
    album: 'Test Album',
    genres: ['Rock'],
    coverImage: 'cover.jpg',
  };
  
  export const trackResponseFixture: Track = {
    ...trackInputFixture,
    id: '1',
    slug: 'test-song',
    audioFile: 'audio.mp3',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  };
  