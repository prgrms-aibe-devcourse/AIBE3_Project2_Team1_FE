import createClient from 'openapi-fetch/dist/index.cjs';
import { paths } from './apiV1/schema.d';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const client = createClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: 'include',
});
