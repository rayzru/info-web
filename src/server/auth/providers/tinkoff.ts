import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface TinkoffProfile {
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
}

/**
 * Тинькофф ID (T-ID) OAuth Provider
 *
 * @see https://www.tinkoff.ru/developer/products/t-id/
 *
 * Для подключения T-ID необходимо:
 * 1. Зарегистрировать приложение на developer.tinkoff.ru
 * 2. Получить client_id и client_secret
 */
export default function TinkoffProvider(
  config: OAuthUserConfig<TinkoffProfile>
): OAuthConfig<TinkoffProfile> {
  return {
    id: "tinkoff",
    name: "Т-Банк",
    type: "oauth",
    wellKnown: "https://id.tinkoff.ru/.well-known/openid-configuration",
    authorization: {
      params: {
        scope: "openid profile email phone",
        response_type: "code",
      },
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
        image: null, // T-ID не предоставляет аватар
      };
    },
    style: {
      bg: "#ffdd2d", // Тинькофф жёлтый
      text: "#333",
    },
    clientId: config.clientId,
    clientSecret: config.clientSecret,
  };
}
