import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Polar } from "@polar-sh/sdk";
import { Resend } from "resend";
import { getCreditsForProduct } from "~/lib/polar-credits";

import { env } from "~/env";
import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { db } from "~/server/db";

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: "production",
});

const resend = new Resend(env.RESEND_API_KEY);


export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
   baseURL: env.BETTER_AUTH_URL,

   trustedOrigins: [
    "http://localhost:3050",
    "https://ai-image-toolkit-three.vercel.app",
    "https://ai-image-toolkit-bm5tik14i-blog-app-next.vercel.app",
    "https://*.vercel.app",
    "https://ai.dawidfrankowicz.com"
  ],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },
  

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,

    sendVerificationEmail: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: env.EMAIL_FROM,
        to: user.email,
        subject: "Verify your email address",
        html: `
          <!doctype html>
          <html lang="en">
            <body
              style="
                margin: 0;
                padding: 0;
                background-color: #f8fafc;
                font-family: Arial, Helvetica, sans-serif;
              "
            >
              <div style="padding: 40px 16px;">
                <div
                  style="
                    max-width: 560px;
                    margin: 0 auto;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                    border-radius: 18px;
                    background-color: #ffffff;
                    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
                  "
                >
                  <div
                    style="
                      padding: 28px 32px;
                      background: linear-gradient(
                        135deg,
                        #172554,
                        #1e3a8a,
                        #312e81
                      );
                    "
                  >
                    <div
                      style="
                        color: #ffffff;
                        font-size: 24px;
                        font-weight: 700;
                      "
                    >
                      AI Image Editor
                    </div>

                    <div
                      style="
                        margin-top: 6px;
                        color: #bfdbfe;
                        font-size: 14px;
                      "
                    >
                      AI-powered image tools
                    </div>
                  </div>

                  <div style="padding: 34px 32px;">
                    <h1
                      style="
                        margin: 0 0 16px;
                        color: #0f172a;
                        font-size: 28px;
                        line-height: 1.25;
                      "
                    >
                      Verify your email
                    </h1>

                    <p
                      style="
                        margin: 0;
                        color: #475569;
                        font-size: 16px;
                        line-height: 1.7;
                      "
                    >
                      Welcome to AI Image Toolkit. Confirm your email address to
                      activate your account and access your image projects and
                      editing tools.
                    </p>

                    <div style="margin-top: 28px;">
                      <a
                        href="${url}"
                        style="
                          display: inline-block;
                          padding: 14px 24px;
                          border-radius: 10px;
                          background: linear-gradient(
                            90deg,
                            #2563eb,
                            #9333ea
                          );
                          color: #ffffff;
                          font-size: 15px;
                          font-weight: 700;
                          text-decoration: none;
                        "
                      >
                        Verify email address
                      </a>
                    </div>

                    <p
                      style="
                        margin: 28px 0 0;
                        color: #64748b;
                        font-size: 13px;
                        line-height: 1.6;
                      "
                    >
                      This verification link expires in one hour.
                    </p>

                    <p
                      style="
                        margin: 8px 0 0;
                        color: #94a3b8;
                        font-size: 13px;
                        line-height: 1.6;
                      "
                    >
                      If you did not create this account, you can safely ignore
                      this email.
                    </p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error("Failed to send verification email:", error);
        throw new Error("Failed to send verification email");
      }
    },
  },

  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "2936d517-b6b8-4afa-8016-82508de848a9",
              slug: "small",
            },
            {
              productId: "ca9df392-3a7f-44eb-b050-70b16eb4e2a6",
              slug: "medium",
            },
            {
              productId: "29381f1e-0f43-407e-a15d-73c4db0a9a98",
              slug: "large",
            },
          ],
          successUrl: "/dashboard?payment=success",
          authenticatedUsersOnly: true,
        }),

        portal(),

        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,

          onOrderPaid: async (order) => {
            console.log(
              "POLAR WEBHOOK ORDER PAID",
              order.data.productId,
            );
            const polarOrderId = order.data.id;

         const externalCustomerId = order.data.customer.externalId;
          const customerEmail = order.data.customer.email;

          let user = externalCustomerId
            ? await db.user.findUnique({
                where: {
                  id: externalCustomerId,
                },
              })
            : null;

            user ??= await db.user.findUnique({

              where: {
                email: customerEmail,
              },
            });
          

if (!user) {
  console.error("No matching user found for Polar order.");
  throw new Error("No matching user found for Polar order.");
}

            const productId = order.data.productId;
    const creditsToAdd = getCreditsForProduct(productId);

if (creditsToAdd === null) {
  console.error("Unknown Polar product:", productId);
  return;
}
     
  const existingPurchase = await db.purchase.findUnique({
  where: {
    polarOrderId,
  },
});

if (existingPurchase) {
  console.log("POLAR ORDER ALREADY PROCESSED", polarOrderId);
  return;
}
 await db.$transaction([
  db.purchase.create({
    data: {
      polarOrderId,
      userId: user.id,
      credits: creditsToAdd,
    },
  }),

  db.user.update({
    where: {
      id: user.id,
    },
    data: {
      credits: {
        increment: creditsToAdd,
      },
    },
  }),
]);
          },
        }),
      ],
    }),
  ],
});