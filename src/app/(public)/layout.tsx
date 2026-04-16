import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getVenueDetails } from "@/lib/data/fetchers";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const venue = await getVenueDetails();
  return (
    <>
      <Header openTableUrl={venue.opentable_url} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
