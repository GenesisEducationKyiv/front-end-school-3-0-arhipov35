import { Option, O, pipe } from '@mobily/ts-belt';
import { TrackFilters, TrackFiltersSchema } from '@/types/track';


export function filtersFromQueryString(query: string): Option<TrackFilters> {
  const params = new URLSearchParams(query);
  const raw: Partial<Record<keyof TrackFilters, string>> = {};
  params.forEach((value, key) => {
    raw[key as keyof TrackFilters] = value;
  });
  const parsed: Partial<TrackFilters> = {
    ...raw,
    page: raw.page ? Number(raw.page) : undefined,
    limit: raw.limit ? Number(raw.limit) : undefined,
    sort: raw.sort as TrackFilters['sort'] | undefined,
    order: raw.order as TrackFilters['order'] | undefined,
    search: raw.search,
    genre: raw.genre,
    artist: raw.artist,
  };
  const result = TrackFiltersSchema.safeParse(parsed);
  return result.success ? O.Some(result.data) : O.None;
}


export function filtersToQueryString(filters: TrackFilters): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    pipe(
      value as string | number | undefined,
      O.fromNullable,
      O.filter((v) => v !== ''),
      O.tap((v) => params.set(key, String(v))) 
    );
  });

  return params.toString();
}
