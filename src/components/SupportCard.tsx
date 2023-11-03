import styles from './SupportCard.module.scss';

export const SupportCard = () => {
  return (
    <div className={ styles.support }>
      <div>Не хватает информации или нашли ошибку?</div>
      <div>Напишите мне в <a target='_blank' href='https://t.me/rayzru' className={ styles.link }>Telegram</a></div>
    </div>
  );
};
