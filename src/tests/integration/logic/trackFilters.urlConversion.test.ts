import { describe, it, expect } from 'vitest';
import { filtersFromQueryString, filtersToQueryString } from '@/features/tracks/utils/urlFilters';
import { originalFilters, partialFilters } from '@/tests/integration/logic/fixtures/trackFilters.fixtures';

describe('Track Filters Integration Tests', () => {
  describe('URL Filters Roundtrip Integration', () => {
    it('should convert filters to query string and back without data loss', () => {
      const queryString = filtersToQueryString(originalFilters);

      const parsedFilters = filtersFromQueryString(queryString);
      expect(parsedFilters).toEqual(originalFilters);
    });


    it('should handle partial filters', () => {
      const queryString = filtersToQueryString(partialFilters);

      const parsedFilters = filtersFromQueryString(queryString);
      expect(parsedFilters).toEqual(partialFilters);
    });
  });
});
