import { useAutoRefresh } from '@features/auth/hooks/use-auto-refresh.ts';
import { AppRouter } from '@app/router/AppRouter';

export default function App() {
  useAutoRefresh();

  return <AppRouter />;
}
