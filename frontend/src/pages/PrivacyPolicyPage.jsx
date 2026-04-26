import React from "react";
import Navbar from "../components/common/Navbar";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <div
            className="space-y-6 leading-relaxed"
            style={{ color: "var(--color-text)" }}
          >
            <p>
              At Blue Dimension, taking care of your privacy is extremely
              important to us. This Privacy Policy outlines the types of
              personal information we receive and collect when you use our
              services, as well as how we safeguard your information.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8">
              Information We Collect
            </h2>
            <p>
              When you create an account, we may collect minimal identifying
              information, such as your email address and full name. This is
              used strictly for identifying your account and providing the
              automated mailing services. We do not sell your data.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8">
              How We Use Information
            </h2>
            <p>
              The information we collect is used to operate, maintain, and
              improve the features and functionality of Blue Dimension. It also
              helps us provide you with personalized content, security alerts,
              and administrative messages.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-8">
              Data Security
            </h2>
            <p>
              We employ commercial security standards to protect your personal
              data. However, please note that no method of transmission over the
              internet, or method of electronic storage is 100% secure.
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
