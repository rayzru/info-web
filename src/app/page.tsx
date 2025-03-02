import { BuildingsMap } from "@sr2/components/buildings-map";
import Weather from "@sr2/components/weather";
import { fetchWeather } from "@sr2/lib/weather";

async function getWeather() {
  const res = await fetchWeather();
  return res;
}

export default async function Home() {
  const weather = await getWeather();
  console.log(weather);
  // void api.post.getLatest.prefetch();


  return (
    // <HydrateClient>
    <>
      <Weather {...weather} />
      <BuildingsMap />
    </>
    // </HydrateClient>
  );
}
