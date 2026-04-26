import React from "react";
import Navbar from "../components/common/Navbar";

export default function TermsPage() {
  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <Navbar />
      <div className="flex-1 w-full max-w-4xl mx-auto p-6 py-12">
        <div
          className="rounded-3xl shadow-xl p-8 md:p-12"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h1 className="text-4xl font-extrabold text-primary mb-6">
            Terms of Service
          </h1>
          <div
            className="space-y-6 leading-relaxed"
            style={{ color: "var(--color-text)" }}
          >
            <p>
              Welcome to Blue Dimension. These Terms of Service ("Terms") govern
              your use of our platform and services. By accessing or using Blue
              Dimension, you agree to be bound by these Terms.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8">
              1. Account Responsibilities
            </h2>
            <p>
              You are responsible for safeguarding the password that you use to
              access the Service and for any activities or actions under your
              password. Blue Dimension cannot and will not be liable for any
              loss or damage arising from your failure to comply with this
              responsibility.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8">
              2. Acceptable Use
            </h2>
            <p>
              Our service is intended to provide a seamless and secure
              experience for sending mails automatically. You agree not to
              misuse our platform in a way that violates any laws, infringes on
              the rights of others, or disrupts our infrastructure.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8">
              3. Termination
            </h2>
            <p>
              We may terminate or suspend access to our Service immediately,
              without prior notice or liability, for any reason whatsoever,
              including without limitation if you breach the Terms.
            </p>

            <p
              className="mt-8 text-sm"
              style={{ color: "var(--color-text-sub)" }}
            >
              Last updated: August 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
