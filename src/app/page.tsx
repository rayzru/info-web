import { getServerAuthSession } from "@sr2/server/auth";
import { api, HydrateClient } from "@sr2/trpc/server";
import styles from "./index.module.scss";

export default async function Home() {
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className={ styles.main }>
      </main>
    </HydrateClient>
  );
}
