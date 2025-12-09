import crypto from "crypto";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface OdnoklassnikiProfile {
  uid: string;
  name: string;
  first_name: string;
  last_name: string;
  email?: string;
  pic_1: string; // 50x50
  pic_2: string; // 128x128
  pic_3: string; // 190x190
  pic_full: string;
  gender: string;
  birthday: string;
  age: number;
  locale: string;
  location: {
    city: string;
    country: string;
    countryCode: string;
    countryName: string;
  };
}

export interface OdnoklassnikiConfig
  extends OAuthUserConfig<OdnoklassnikiProfile> {
  publicKey: string;
}

/**
 * Одноклассники OAuth Provider
 *
 * @see https://apiok.ru/dev/app/oauth
 */
export default function Odnoklassniki(
  config: OdnoklassnikiConfig
): OAuthConfig<OdnoklassnikiProfile> {
  return {
    id: "odnoklassniki",
    name: "Одноклассники",
    type: "oauth",
    authorization: {
      url: "https://connect.ok.ru/oauth/authorize",
      params: {
        scope: "VALUABLE_ACCESS;GET_EMAIL",
        response_type: "code",
      },
    },
    token: {
      url: "https://api.ok.ru/oauth/token.do",
      async request({ params, provider }: { params: Record<string, unknown>; provider: { clientId?: string; clientSecret?: string } }) {
        const response = await fetch(
          "https://api.ok.ru/oauth/token.do",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              code: params.code as string,
              client_id: provider.clientId as string,
              client_secret: provider.clientSecret as string,
              redirect_uri: params.redirect_uri as string,
              grant_type: "authorization_code",
            }),
          }
        );
        const tokens = await response.json();
        return { tokens };
      },
    },
    userinfo: {
      url: "https://api.ok.ru/fb.do",
      async request({ tokens, provider }: { tokens: { access_token?: string }; provider: { clientSecret?: string } }) {
        const accessToken = tokens.access_token as string;

        // OK API requires signature
        // sig = md5(sorted params + md5(access_token + application_secret_key))
        const params = {
          application_key: config.publicKey,
          format: "json",
          method: "users.getCurrentUser",
          fields:
            "uid,name,first_name,last_name,email,pic_1,pic_2,pic_3,pic_full,gender,birthday,age,locale,location",
        };

        const secretKey = crypto
          .createHash("md5")
          .update(accessToken + provider.clientSecret)
          .digest("hex");

        const sortedParams = Object.keys(params)
          .sort()
          .map((key) => `${key}=${params[key as keyof typeof params]}`)
          .join("");

        const sig = crypto
          .createHash("md5")
          .update(sortedParams + secretKey)
          .digest("hex");

        const url = new URL("https://api.ok.ru/fb.do");
        url.searchParams.set("access_token", accessToken);
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.set(key, value);
        });
        url.searchParams.set("sig", sig);

        const response = await fetch(url.toString());
        return await response.json();
      },
    },
    profile(profile) {
      return {
        id: profile.uid,
        name: profile.name ?? `${profile.first_name} ${profile.last_name}`,
        email: profile.email ?? null,
        image: profile.pic_full ?? profile.pic_3 ?? profile.pic_2,
      };
    },
    style: {
      bg: "#ee8208",
      text: "#fff",
    },
    clientId: config.clientId,
    clientSecret: config.clientSecret,
  };
}
