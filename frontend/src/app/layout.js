import { Providers } from './components/Providers';
import { AppProvider } from './AppContext';
import '@rainbow-me/rainbowkit/styles.css';


export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <AppProvider>
          <Providers>{children}</Providers>
        </AppProvider>
      </body>
    </html>
  );
}
