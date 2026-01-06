import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import AuthProvider from "@/utils/authProvider";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
      <AuthProvider mode="private">
        <Header />
        {children}
        <Footer />
      </AuthProvider>
      </>
  );
}
