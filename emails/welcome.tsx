import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import * as React from "react";

type InviteUserEmailProps = {
  toEmail: string;
};

export default function WelcomeEmail({
  toEmail = "jane@company.com",
}: InviteUserEmailProps) {
  const toName = toEmail.split("@")[0];

  return (
    <Html>
      <Head />
      <Preview>{`Welcome to NeoRepo ${toName}!`}</Preview>
      <Section style={main}>
        <Container style={container}>
          We are excited to have you on board!
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
