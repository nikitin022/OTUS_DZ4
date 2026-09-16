import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { MapPage } from '../features/map/ui/MapPage';
import { FeedPage } from '../features/feed/ui/FeedPage';
import { ProfilePage } from '../features/profile/ui/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <MapPage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'feed', element: <FeedPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: '*', element: <MapPage /> },
    ],
  },
]);
