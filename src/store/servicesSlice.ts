import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { api, listStars, type StarsResponse } from '../api/services';
import { errorMessage } from '../api/http';
import type { Filters, Star } from '../types';
import { stars } from '../data/stars';

type ServicesState = {
  items: Star[]; current: Star | null; draft: Star | null; filters: Filters;
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; error: string | null;
};
const initialState: ServicesState = { items: stars, current: null, draft: null, filters: { maxDistance: '' }, status: 'idle', error: null };

export const fetchStars = createAsyncThunk<StarsResponse, { authenticated: boolean }>('services/fetchStars', async ({ authenticated }, { getState, rejectWithValue }) => {
  try {
    const filters = (getState() as RootState).services.filters;
    return await listStars({ ...filters, authenticated });
  } catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const fetchFeed = createAsyncThunk<Star, { id?: number; next?: boolean }>('services/fetchFeed', async ({ id, next }, { rejectWithValue }) => {
  try { return await api.getFeed(id, next); } catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const createStar = createAsyncThunk<void, { name: string; image: Blob; video: Blob }>('services/createStar', async (formData, { rejectWithValue }) => {
  try { await api.createStar(formData); } catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const fetchDraft = createAsyncThunk<Star>('services/fetchDraft', async (_, { rejectWithValue }) => {
  try { return await api.getDraft(); } catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const publishStar = createAsyncThunk<void, { id: number; name: string; catalog_id: string; distance_kpc: number; velocity_kms: number; description: string }>('services/publishStar', async ({ id, ...body }, { rejectWithValue }) => {
  try { await api.publishStar(id, body); } catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const deleteStar = createAsyncThunk<number, number>('services/deleteStar', async (id, { rejectWithValue }) => {
  try { await api.deleteStar(id); return id; } catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const toggleLike = createAsyncThunk<{ id: number; liked: boolean }, { id: number; liked: boolean }>('services/toggleLike', async ({ id, liked }, { rejectWithValue }) => {
  try { await api.likeStar(id, liked ? 0 : 1); return { id, liked: !liked }; } catch (error) { return rejectWithValue(errorMessage(error)); }
});

const servicesSlice = createSlice({
  name: 'services', initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Filters>) => { state.filters = action.payload; },
    resetFilters: (state) => { state.filters = { maxDistance: '' }; },
    clearForGuest: (state) => { state.items = []; state.current = null; state.draft = null; state.filters = { maxDistance: '' }; },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStars.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchStars.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload.items; })
      .addCase(fetchStars.rejected, (state, action) => { state.status = 'failed'; state.error = String(action.payload || action.error.message); })
      .addCase(fetchFeed.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchFeed.fulfilled, (state, action) => { state.status = 'succeeded'; state.current = action.payload; })
      .addCase(fetchFeed.rejected, (state, action) => { state.status = 'failed'; state.error = String(action.payload || action.error.message); })
      .addCase(createStar.pending, (state) => { state.status = 'loading'; })
      .addCase(createStar.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(createStar.rejected, (state, action) => { state.status = 'failed'; state.error = String(action.payload || action.error.message); })
      .addCase(fetchDraft.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchDraft.fulfilled, (state, action) => { state.status = 'succeeded'; state.draft = action.payload; })
      .addCase(fetchDraft.rejected, (state, action) => { state.status = 'failed'; state.error = String(action.payload || action.error.message); })
      .addCase(publishStar.pending, (state) => { state.status = 'loading'; })
      .addCase(publishStar.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(publishStar.rejected, (state, action) => { state.status = 'failed'; state.error = String(action.payload || action.error.message); })
      .addCase(deleteStar.fulfilled, (state, action) => { state.items = state.items.filter((star) => star.id !== action.payload); })
      .addCase(toggleLike.fulfilled, (state, action) => { const star = state.items.find((item) => item.id === action.payload.id) || (state.current?.id === action.payload.id ? state.current : null); if (star) { star.is_liked = action.payload.liked ? 1 : 0; star.likes_count += action.payload.liked ? 1 : -1; } });
  },
});

export const { setFilters, resetFilters, clearForGuest } = servicesSlice.actions;
export default servicesSlice.reducer;
export type RootState = { services: ServicesState };
