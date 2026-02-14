import { LinkedAccounts } from "~/components/linked-accounts";
import { PageHeader } from "~/components/page-header";
import { getAvailableProviders } from "~/server/auth/config";

export default function SecurityPage() {
  const availableProviders = getAvailableProviders();

  return (
    <div>
      <PageHeader
        title="Безопасность"
        description="Управление способами входа и безопасностью аккаунта"
      />

      <section>
        <h2 className="mb-6 border-b pb-3 text-lg font-medium">Способы входа</h2>
        <LinkedAccounts availableProviders={availableProviders} />
      </section>
    </div>
  );
}
