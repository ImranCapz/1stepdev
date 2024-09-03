import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  favorites: [],
  loading: false,
  error: null,
  isFavorite: false,
};

export const favoriteList = createAsyncThunk(
  "favorite/favoriteList",
  async (userId) => {
    const res = await fetch(`/server/favorite/favoriteList/${userId}`);
    const data = await res.json();
    if (data.success === false) {
      throw new Error(data.message || "Failed to fetch favorite list");
    }
    return data.favorites;
  }
);

export const toggleFavorite = createAsyncThunk(
  "favorite/toggleFavorite",
  async ({ userId, providerId }) => {
    try {
      const res = await fetch(
        `/server/favorite/favorites/${userId}?providerId=${providerId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            providerId: providerId,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update favorite status");
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const fetchFavoriteStatus = createAsyncThunk(
  "favorite/fetchFavoriteStatus",
  async ({ userId, providerId }) => {
    const res = await fetch(
      `/server/favorite/favoriteStatus/${userId}?providerId=${providerId}`
    );
    const data = await res.json();
    if (data.success === false) {
      throw new Error(data.message || "Failed to fetch favorite status");
    }
    return data.isFavorite;
  }
);

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    getFavoritesStart: (state) => {
      state.loading = true;
    },
    getFavoritesSuccess: (state, action) => {
      state.favorites = action.payload;
      state.loading = false;
      state.error = null;
    },
    getFavoritesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    favoriteOut: (state) => {
      (state.favorites = null), (state.loading = false), (state.error = null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.status = "success";
        if (action.payload.isFavorite) {
          state.favorites.push(action.payload.providerId);
        } else {
          state.favorites = state.favorites.filter(
            (favorite) => favorite !== action.payload.providerId
          );
        }
      })
      .addCase(fetchFavoriteStatus.fulfilled, (state, action) => {
        state.isFavorite = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(favoriteList.pending, (state) => {
        state.loading = true;
      })
      .addCase(favoriteList.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.loading = false;
      })
      .addCase(favoriteList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  getFavoritesStart,
  getFavoritesSuccess,
  getFavoritesFailure,
  favoriteOut,
} = favoriteSlice.actions;

export default favoriteSlice.reducer;
