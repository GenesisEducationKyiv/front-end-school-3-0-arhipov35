import { Track } from '@/types/track';
import { test, expect } from '@playwright/experimental-ct-react';
import TrackItem from '@/features/tracks/components/TrackList/components/TrackItem';



test.describe('TrackItem component', () => {
  const sampleTrack: Track = {
    id: '1',
    title: 'Test Track',
    artist: 'Test Artist',
    album: 'Test Album',
    genres: ['rock', 'pop'],
    slug: 'test-track',
    coverImage: 'https://placehold.co/60x60?text=Cover',
    audioFile: '',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  };

  test('renders track data and buttons, interacts correctly', async ({ mount }) => {
    let editClicked = false;
    let uploadClicked = false;
    let toggleSelectCalled = false;

    const component = await mount(
      <TrackItem
        track={sampleTrack}
        isBulkSelectEnabled={true}
        isSelected={false}
        toggleSelectTrack={() => { toggleSelectCalled = true; }}
        onEditClick={() => { editClicked = true; }}
        onDeleteClick={() => { }}
        onUploadClick={() => { uploadClicked = true; }}
        getDefaultCoverImage={() => 'https://placehold.co/60x60?text=Default'}
      />
    );

    await expect(component.locator('[data-testid="track-item-1-title"]')).toHaveText('Test Track');
    await expect(component.locator('[data-testid="track-item-1-artist"]')).toHaveText('Test Artist');

    await component.locator('input[type="checkbox"]').click();
    expect(toggleSelectCalled).toBe(true);

    await component.locator('[data-testid="edit-track-1"]').click();
    expect(editClicked).toBe(true);

    await component.locator('[data-testid="upload-track-1"]').click();
    expect(uploadClicked).toBe(true);

    expect(await component.locator('[data-testid="delete-track-1"]').count()).toBe(0);
  });
});
