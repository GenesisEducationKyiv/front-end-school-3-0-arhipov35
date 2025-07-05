import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { trackInputFixture, trackResponseFixture } from '@/tests/unit/fixtures/track';
import * as trackApi from '@/features/tracks/api/apiSlice'; 
// whitebox test
describe('useCreateTrackMutation', () => {
  it('successfully calls createTrack with input data', async () => {
    const input = trackInputFixture;
    const fakeResponse = { data: trackResponseFixture };

    const mockCreateTrack = vi.fn().mockResolvedValue(fakeResponse);

    vi.spyOn(trackApi, 'useCreateTrackMutation').mockReturnValue([
      mockCreateTrack,
      { isLoading: false, isError: false, error: null, reset: vi.fn() },
    ]);

    const { result } = renderHook(() => trackApi.useCreateTrackMutation());

    await act(async () => {
      await result.current[0](input);
    });

    expect(mockCreateTrack).toHaveBeenCalledOnce();
    expect(mockCreateTrack).toHaveBeenCalledWith(input);
  });

  it('handles an error when calling createTrack', async () => {
    const input = trackInputFixture;
    const mockCreateTrack = vi.fn().mockRejectedValue(new Error('Network error'));

    vi.spyOn(trackApi, 'useCreateTrackMutation').mockReturnValue([
      mockCreateTrack,
      { isLoading: false, isError: true, error: { message: 'Network error' }, reset: vi.fn() },
    ]);

    const { result } = renderHook(() => trackApi.useCreateTrackMutation());

    await expect(result.current[0](input)).rejects.toThrow('Network error');
  });
});
