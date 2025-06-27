import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router';
import App from './App';
import Layout from './Layouts';
import DeskLayoutPage from './pages/DeskLayoutPage';
import PeoplePage from './pages/PeoplePage';
import TeamsPage from './pages/TeamsPage';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

const node = document.getElementById('root');
if (node === null) {
  throw new Error('no root node');
}
const router = createBrowserRouter([
  {
    Component: App, // root layout route
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: 'teams',
            Component: TeamsPage,
          },
          {
            path: 'people',
            Component: PeoplePage,
          },
          {
            path: 'layout',
            Component: DeskLayoutPage,
          },
        ],
      },
    ],
  },
]);

const root = createRoot(node);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>,
);
