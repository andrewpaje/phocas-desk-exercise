import type { Navigation } from '@toolpad/core/AppProvider';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet } from 'react-router';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'people',
    title: 'People',
  },
  {
    segment: 'teams',
    title: 'Teams',
  },
  {
    segment: 'layout',
    title: 'Desk Layout',
  },
];

const BRANDING = {
  title: 'My Desk layout App',
};

export default function CustomPageContainer() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />{' '}
    </ReactRouterAppProvider>
  );
}
