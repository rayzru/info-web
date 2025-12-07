import { BuildingsMap } from "~/components/buildings-map";
import Weather from "~/components/weather";
import { fetchWeather } from "~/lib/weather";
import { HydrateClient } from "~/trpc/server";

export const metadata = {
  title: "Карта и погода | SR2",
  description: "Интерактивная карта зданий ЖК и текущая погода",
};

async function getWeather() {
  return await fetchWeather();
}

export default async function MapPage() {
  const weather = await getWeather();

  return (
    <HydrateClient>
      <>
        <Weather {...weather} key={"weather"} />
        <BuildingsMap key={"map"} />
      </>
    </HydrateClient>
  );
}
