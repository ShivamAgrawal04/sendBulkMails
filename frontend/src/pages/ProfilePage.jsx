import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineEnvelope,
  HiOutlineKey,
  HiPlus,
  HiTrash,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/authSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();

  const { isLoading, user, error } = useSelector((state) => state.auth);

  const [loginMail, setLoginMail] = useState(user?.userEmail || "");

  const [emailAccounts, setEmailAccounts] = useState(
    user?.emailAccounts?.length > 0
      ? user.emailAccounts
      : [{ email: "", googleAppPassword: "" }]
  );

  useEffect(() => {
    if (user && user.emailAccounts) {
      setEmailAccounts(user.emailAccounts);
    }
  }, [user]);

  const handleAccountChange = (index, field, value) => {
    const updatedAccounts = [...emailAccounts];
    if (!updatedAccounts[index]) return;

    updatedAccounts[index] = {
      ...updatedAccounts[index],
      [field]: value,
    };
    setEmailAccounts(updatedAccounts);
  };

  const handleAddAccount = () => {
    setEmailAccounts([...emailAccounts, { email: "", googleAppPassword: "" }]);
  };

  const handleRemoveAccount = (index) => {
    const updatedAccounts = emailAccounts.filter((_, i) => i !== index);
    setEmailAccounts(updatedAccounts);
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateUser({ emailAccounts: emailAccounts }));
  };

  const inputStyle = {
    backgroundColor: "var(--color-surface)",
    color: "var(--color-text)",
    borderColor: "var(--color-border)",
  };

  return (
    <div
      className="w-full p-4 md:p-8 flex justify-center items-start"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <Toaster position="top-center" />

      <div
        className="w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="h-3 bg-primary w-full"></div>

        <div className="p-8">
          {/* Header */}
          <div
            className="flex items-center gap-4 mb-8 border-b pb-6"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <HiOutlineUserCircle size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-primary tracking-tight">
                Profile Settings
              </h1>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-sub)" }}>
                Manage your login and sending configurations.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* LOGIN MAIL SECTION (Read Only) */}
            <div>
              <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-accent rounded-full"></span>
                Primary Login
              </h2>
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1"
                  style={{ color: "var(--color-text-sub)" }}
                >
                  Login Email Address
                </label>
                <div className="relative group">
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "var(--color-text-sub)" }}
                  >
                    <HiOutlineEnvelope size={22} />
                  </div>
                  <input
                    disabled
                    readOnly
                    type="email"
                    value={loginMail}
                    className="w-full font-bold pl-11 pr-4 py-3 rounded-xl border outline-none"
                    style={{
                      ...inputStyle,
                      backgroundColor: "var(--color-surface-alt)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* SENDING CONFIGURATIONS */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <span className="w-1 h-6 bg-accent rounded-full"></span>
                  Sending Configuration
                </h2>
                <span
                  className="text-xs px-2 py-1 rounded-md font-medium"
                  style={{
                    backgroundColor: "var(--color-surface-alt)",
                    color: "var(--color-text-sub)",
                  }}
                >
                  SMTP Setup
                </span>
              </div>

              <div className="space-y-4">
                {emailAccounts.map((account, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl relative transition-shadow hover:shadow-md"
                    style={{
                      border: "1px solid var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                    }}
                  >
                    {emailAccounts.length > 1 && (
                      <button
                        onClick={() => handleRemoveAccount(index)}
                        className="absolute top-4 right-4 transition-colors"
                        style={{ color: "var(--color-border-hover)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "var(--color-border-hover)")
                        }
                      >
                        <HiTrash size={20} />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Sending Email Input */}
                      <div>
                        <label
                          className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1"
                          style={{ color: "var(--color-text-sub)" }}
                        >
                          Sending Email {index + 1}
                        </label>
                        <div className="relative group">
                          <div
                            className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
                            style={{ color: "var(--color-text-sub)" }}
                          >
                            <HiOutlineEnvelope size={20} />
                          </div>
                          <input
                            type="email"
                            value={account.email}
                            onChange={(e) =>
                              handleAccountChange(index, "email", e.target.value)
                            }
                            placeholder="sender@gmail.com"
                            className="w-full font-medium pl-10 pr-4 py-3 rounded-lg border outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      {/* Google App Password Input */}
                      <div>
                        <label
                          className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1"
                          style={{ color: "var(--color-text-sub)" }}
                        >
                          Google App Password
                        </label>
                        <div className="relative group">
                          <div
                            className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
                            style={{ color: "var(--color-text-sub)" }}
                          >
                            <HiOutlineKey size={20} />
                          </div>
                          <input
                            type="text"
                            value={account.googleAppPassword || ""}
                            onChange={(e) =>
                              handleAccountChange(
                                index,
                                "googleAppPassword",
                                e.target.value
                              )
                            }
                            placeholder="xxxx xxxx xxxx xxxx"
                            className="w-full font-medium pl-10 pr-4 py-3 rounded-lg border outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-mono"
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddAccount}
                className="mt-4 w-full border-2 border-dashed font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-accent/5"
                style={{
                  borderColor: "var(--color-border-hover)",
                  color: "var(--color-text-sub)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--brand-accent)";
                  e.currentTarget.style.color = "var(--brand-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border-hover)";
                  e.currentTarget.style.color = "var(--color-text-sub)";
                }}
              >
                <HiPlus size={20} />
                <span>Add Another Sending Account</span>
              </button>
            </div>

            <div
              className="pt-6 border-t flex justify-end"
              style={{ borderColor: "var(--color-border)" }}
            >
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-95 flex items-center gap-2"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
