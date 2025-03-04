import { BuildingsMap } from "~/components/buildings-map";
import Weather from "~/components/weather";
import { fetchWeather } from "~/lib/weather";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

async function getWeather() {
  return await fetchWeather();
}

export default async function Home() {
  const session = await auth();
  const weather = await getWeather();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <>
        <Weather {...weather} key={"weather"} />
        <BuildingsMap key={"map"} />
      </>
    </HydrateClient>
  );
}
