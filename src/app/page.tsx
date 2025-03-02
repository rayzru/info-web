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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          {session?.user && <>User is logged, Session Data</>}
        </div>
      </main>
    </HydrateClient>
  );
}
