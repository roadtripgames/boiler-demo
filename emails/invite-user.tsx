import type { Team, User } from "@prisma/client";
import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Link } from "@react-email/link";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import * as React from "react";

type InviteUserEmailProps = {
  toEmail: string;
  from: { name: string; email?: string };
  team: { name: string; image?: string };
};

export default function InviteUserEmail({
  toEmail = "jane@company.com",
  from = { name: "Jack Nicholson", email: "jack@company.com" },
  team = { name: "Shining Cast" },
}: InviteUserEmailProps) {
  // const baseUrl = process.env.VERCEL_URL
  //   ? `https://${process.env.VERCEL_URL}`
  //   : "http://localhost:3000";

  const baseUrl = "https://boiler-omega.vercel.app";
  const toName = toEmail.split("@")[0];

  return (
    <Html>
      <Head />
      <Preview>{`Join ${team.name} on Selene`}</Preview>
      <Section style={main}>
        <Container style={container}>
          <Section style={{ marginTop: "32px" }}>
            <Img
              src={`${baseUrl}/logo.svg`}
              width="40"
              height="37"
              alt="Vercel"
              style={logo}
            />
          </Section>
          <Text style={h1}>
            Join <strong>{team.name}</strong> on <strong>Selene</strong>
          </Text>
          <Text style={text}>Hello {toName},</Text>
          <Text style={text}>
            <strong>{from.name}</strong> (
            <Link href={`mailto:${from.email}`} style={link}>
              {from.email}
            </Link>
            ) has invited you to the <strong>{team.name}</strong> team.
          </Text>
          <table
            style={spacing}
            border={0}
            cellPadding="0"
            cellSpacing="10"
            align="center"
          >
            <tr>
              <td style={center} align="center" valign="middle">
                <Img
                  style={avatar}
                  src={
                    "https://lh3.googleusercontent.com/a/AEdFTp50ugZP5FzNVhO1H5rNPLus5906A39PZH7MDak2=s96-c"
                  }
                  width="64"
                  height="64"
                />
              </td>
            </tr>
          </table>
          <Section style={{ textAlign: "center" }}>
            <Button
              pX={20}
              pY={12}
              style={btn}
              href="https://vercel.com/teams/invite/foo"
            >
              Join the team
            </Button>
          </Section>
          {/* <Text style={text}>
            <br />
            or copy and paste this URL into your browser:{" "}
            <Link
              href="https://vercel.com/teams/invite/foo"
              target="_blank"
              style={link}
              rel="noreferrer"
            >
              https://vercel.com/teams/invite/foo
            </Link>
          </Text> */}
          <Hr style={hr} />
          <Text style={footer}>
            This invitation was intended for{" "}
            <span style={black}>{toEmail}</span>. If you were not expecting this
            invitation, you can ignore this email. If you are concerned about
            your account&apos;s safety, please reply to this email to get in
            touch with us.
          </Text>
        </Container>
      </Section>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
};

const container = {
  border: "1px solid #eaeaea",
  borderRadius: "5px",
  margin: "40px auto",
  padding: "20px",
  width: "465px",
};

const logo = {
  margin: "0 auto",
  width: 100,
};

const h1 = {
  color: "#000",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "normal",
  textAlign: "center" as const,
  margin: "30px 0",
  padding: "0",
};

const avatar = {
  borderRadius: "100%",
};

const link = {
  color: "#067df7",
  textDecoration: "none",
};

const text = {
  color: "#000",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  lineHeight: "24px",
};

const black = {
  color: "black",
};

const center = {
  verticalAlign: "middle",
};

const btn = {
  backgroundColor: "#000",
  borderRadius: "5px",
  color: "#fff",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  fontWeight: 500,
  lineHeight: "50px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const spacing = {
  marginBottom: "26px",
};

const hr = {
  border: "none",
  borderTop: "1px solid #eaeaea",
  margin: "26px 0",
  width: "100%",
};

const footer = {
  color: "#666666",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "24px",
};
