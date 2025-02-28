import ArticleLayout from "@sr2/components/article-layout";
import { BuildingsMap } from "@sr2/components/buildings-map";
import { ChatButton } from "@sr2/components/chat-button";
import ResponsiveWrapper from "@sr2/components/responsive-wrapper";

export default function Page() {
  return (
    <>
      <ArticleLayout title="Чаты, группы, сообщества">
      <p>Здесь вы найдете ссылки на чаты нашего жилого комплекса.</p>
      <p>В каждом из 9 домов есть свой чат для обсуждения локальных вопросов, а также у нас есть общий чат для всех жителей, собственников и гостей.</p>
      </ArticleLayout>

      <ResponsiveWrapper>
        <h3 className="text-xl font-bold mt-8">Основные чаты</h3>
      <div className="flex flex-row flex-wrap gap-4 mt-8">
        <ChatButton
          title="ЖК Сердце Ростова 2"
          description="Чат для всех жителей ЖК"
          url="https://t.me/serdcerostova2"
          type="telegram"
        />
      </div>
      <div className="flex flex-row flex-wrap gap-4 mt-8">
        <ChatButton
          title="Строение 1"
          url="https://t.me/sr2_s1"
          type="telegram"
        />

        <ChatButton
          title="Строение 2"
          url="https://t.me/sr2_s2"
          type="telegram"
        />

        <ChatButton
          title="Строение 6"
          url="https://t.me/sr2_s6"
          type="telegram"
        />

        <ChatButton
          title="Строение 7"
          url="https://t.me/sr2_s7"
          type="telegram"
        />

      </div>
      <div className="flex flex-row flex-wrap gap-4 mt-8">
        <ChatButton
          title="Литер 1"
          description="Строится"
          url="https://t.me/sr2l1"
          type="telegram"
        />

        <ChatButton
          title="Литер 8"
          description="Строится"
          url="https://t.me/sr2l8"
          type="telegram"
        />

        <ChatButton
          title="Литер 9"
          description="Строится"
          url="https://t.me/sr2_l9"
          type="telegram"
        />
      </div>
      <div className="flex flex-row flex-wrap gap-4 mt-8">
        <ChatButton
          title="Барахолка"
          description="Чат для обьявлений"
          url="https://t.me/sr2_market"
          type="telegram"
        />

        <ChatButton
          title="Авто/Парковки"
          description="Чат для автовладельцев"
          url="https://t.me/sr2_auto"
          type="telegram"
        />

        <ChatButton
          title="Ватцап чат"
          description="Чат ЖК в WhatsApp"
          url="http://go.sr2.today/whatsapp"
          type="whatsapp"
        />

      </div>
      </ResponsiveWrapper>
    </>
  );
}
