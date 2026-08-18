import config from "../config";
import { redisClient } from "./redis";

export const getBkashIdToken = async () => {
  try {
    const IdTokenKey = "bkash:idToken";
    const RefreshToken = "bkash:refreshToken";
    let bkashIdToken = redisClient.get(IdTokenKey);
    if (bkashIdToken) {
      return bkashIdToken;
    }
    const response = await fetch(
      `${config.bkash_base_url}/tokenized/checkout/token/grant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: config.bkash_username,
          password: config.bkash_password,
        },
        body: JSON.stringify({
          app_key: config.bkash_app_key,
          app_secret: config.bkash_app_secret,
        }),
      },
    );
    if (!response.ok) {
      throw new Error("Bkash accesstoken grant failed");
    }

    const result = await response.json();
    await redisClient.set(IdTokenKey, result.id_token, {
      expiration: {
        type: "EX",
        value: 60 * 60,
      },
    });

    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
