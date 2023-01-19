import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { env } from "../../env/server.mjs";
import InviteUserEmail from "../../../emails/invite-user";
import ResetPasswordEmail from "../../../emails/reset-password";

sendgrid.setApiKey(env.SENDGRID_API_KEY);

type EmailType = keyof typeof EMAILS;
type Distribute<U extends EmailType> = U extends unknown
  ? { type: U; props: Parameters<(typeof EMAILS)[U]>[0] }
  : never;
export type Email = Distribute<keyof typeof EMAILS>;

/* Add your emails here */
// TODO: can we do this automatically?
const EMAILS = {
  "invite-user": InviteUserEmail,
  "reset-password": ResetPasswordEmail,
} as const;

export async function send(
  to: string,
  subject: string,
  { type, props: _props }: Email
) {
  const Component = EMAILS[type];

  // unfortunately, we have to cast props to any here,
  // unclear how to infer the props type correctly from the component
  // but the function signature is doing the heavy lifting in terms of type safety
  const props = _props as any;
  const emailHTML = render(<Component {...props} toEmail={to} />);

  sendgrid.send({
    from: {
      email: "hello@hunchling.com",
      name: "Hunchling Test",
    },
    to,
    subject,
    html: emailHTML,
  });
}
