export const metadata = {
  title: "J&ADC Coaching",
  description: "정글·원딜 전문 맞춤형 롤 코칭",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
