export default function HowtosLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="container mx-auto max-w-4xl flex-col md:flex">{children}</div>;
}
