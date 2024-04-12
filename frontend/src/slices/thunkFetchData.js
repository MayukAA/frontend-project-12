/* eslint-disable */

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../utils/routes';

const fetchData = createAsyncThunk(
  'fetchData',
  async () => {
    const { token } = JSON.parse(localStorage.getItem('user'));
    const { data } = await axios.get(routes.dataPath(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },
);

export default fetchData;
