export const metadata = {
  title: 'Auto Slot Machine',
  description: 'Machine à sous automatique interactive',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
