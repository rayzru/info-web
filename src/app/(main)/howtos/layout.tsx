export default function HowtosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="container max-w-4xl mx-auto flex-col md:flex">
      {children}
    </div>
  );
}
