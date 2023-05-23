import { createSlice } from '@reduxjs/toolkit'
import { API_URL } from '../../apiURL'
import axios from 'axios'
import { getBanners, getInnerAd } from '../../lib/supabase'

const initalState = {
  loading: false,
  banners: [],
  innersAds: [],
  error: '',
}

export const fetchAds = async (dispatch, userId) => {
  dispatch(fetchingAds())
  try {
    const banners = await getBanners()

    if (banners) {
      dispatch(fetchedBanners(banners))
    }

    const inners = await getInnerAd()

    if (inners) {
      dispatch(fetchedAds(inners))
    }
  } catch (error) {
    console.log(error.message)
    dispatch(failedFetchBanners(error.message))
  }
}

export const advertsSlice = createSlice({
  name: 'adverts',
  initialState: initalState,
  reducers: {
    fetchingAds: (state) => {
      state.loading = true
    },
    fetchedBanners: (state, action) => {
      state.loading = false
      state.banners = action.payload
      state.error = null
    },
    fetchedAds: (state, action) => {
      state.loading = false
      state.innersAds = action.payload
      state.error = null
    },
    failedFetchAds: (state, action) => {
      state.loading = false
      state.innersAds = null
      state.error = action.payload
    },
    failedFetchBanners: (state, action) => {
      state.loading = false
      state.banners = null
      state.error = action.payload
    },
  },
})

export const {
  fetchingAds,
  fetchedAds,
  fetchedBanners,
  failedFetchAds,
  failedFetchBanners,
} = advertsSlice.actions

export default advertsSlice.reducer
