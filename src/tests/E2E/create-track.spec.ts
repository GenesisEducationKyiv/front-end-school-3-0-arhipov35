import { test, expect } from '@playwright/test';

test('Create a new track from TrackForm and verify it appears in the list', async ({ page }) => {
   // 1. Open the tracks page
  await page.goto('http://localhost:5173/tracks');

  // 2. Click the "Create New Track" button
  await page.click('[data-testid="create-track-button"]');

   // 3. Wait for the form to appear in the modal
  const form = page.locator('[data-testid="track-form"]');
  await expect(form).toBeVisible();

  // 4. Fill in the fields
  await page.fill('[data-testid="input-title"]', 'My Test Track');
  await page.fill('[data-testid="input-artist"]', 'Test Artist');
  await page.fill('[data-testid="input-album"]', 'Test Album');

   // 5. Fill in genres using TagsInput component
  const genreInput = page.locator('[data-testid="genre-selector"] input.tag-input');
  await genreInput.fill('rock');
  await genreInput.press('Enter');

  // 6. image
  await page.fill('[data-testid="input-cover-image"]', 'https://placehold.co/100x100?text=Cover');

  // 7. Submit
  await page.click('[data-testid="submit-button"]');

  const newTrackRow = page.locator('tr', { hasText: 'My Test Track' });
  await expect(newTrackRow).toBeVisible();
});
