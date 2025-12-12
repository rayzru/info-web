import { LinkedAccounts, PasswordSection } from "~/components/linked-accounts";
import { PageHeader } from "~/components/page-header";
import { getAvailableProviders } from "~/server/auth/config";

export default function SecurityPage() {
  const availableProviders = getAvailableProviders();

  return (
    <div>

      <PageHeader
        title="Безопасность"
        description={`Управление способами входа и безопасностью аккаунта`}
      />

      <div className="space-y-12">
        {/* Linked Accounts Section */}
        <section>
          <h2 className="text-lg font-medium pb-3 border-b mb-6">
            Способы входа
          </h2>
          <LinkedAccounts availableProviders={availableProviders} />
        </section>

        {/* Password Section */}
        <section>
          <h2 className="text-lg font-medium pb-3 border-b mb-6">
            Авторизация по паролю
          </h2>
          <PasswordSection />
        </section>
      </div>
    </div>
  );
}
