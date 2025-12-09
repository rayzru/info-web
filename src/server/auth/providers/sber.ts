import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface SberProfile {
  sub: string; // User ID
  name?: string;
  given_name?: string;
  family_name?: string;
  middle_name?: string;
  email?: string;
  email_verified?: boolean;
  phone_number?: string;
  phone_number_verified?: boolean;
  birthdate?: string;
  gender?: string;
}

/**
 * Сбер ID OAuth Provider
 *
 * @see https://developers.sber.ru/docs/ru/sberid/overview
 *
 * Для подключения СберID необходимо:
 * 1. Зарегистрировать приложение на developers.sber.ru
 * 2. Заключить договор со Сбером
 * 3. Пройти модерацию
 */
export default function SberProvider(
  config: OAuthUserConfig<SberProfile>
): OAuthConfig<SberProfile> {
  return {
    id: "sber",
    name: "Сбер ID",
    type: "oauth",
    // Sandbox: https://online.sberbank.ru/CSAFront/oidc/authorize
    // Production: https://online.sberbank.ru/CSAFront/oidc/authorize
    authorization: {
      url: "https://online.sberbank.ru/CSAFront/oidc/authorize",
      params: {
        scope: "openid name email phone",
        response_type: "code",
        // nonce will be generated automatically
      },
    },
    token: {
      url: "https://online.sberbank.ru/CSAFront/oidc/token",
    },
    userinfo: {
      url: "https://online.sberbank.ru/CSAFront/oidc/userinfo",
    },
    profile(profile) {
      return {
        id: profile.sub,
        name:
          profile.name ??
          [profile.family_name, profile.given_name, profile.middle_name]
            .filter(Boolean)
            .join(" ") ??
          null,
        email: profile.email ?? null,
        image: null, // СберID не предоставляет аватар
      };
    },
    style: {
      bg: "#21a038", // Сбер зелёный
      text: "#fff",
    },
    clientId: config.clientId,
    clientSecret: config.clientSecret,
  };
}
