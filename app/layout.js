import './globals.css';

export const metadata = {
  title: 'Aplicación',
  description: 'Aplicación Minimalista',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
