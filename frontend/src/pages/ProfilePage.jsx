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

  // Redux state se values nikalna
  const { isLoading, user, error } = useSelector((state) => state.auth);

  const [loginMail, setLoginMail] = useState(user?.userEmail || "");

  // --- FIX 1: Initialize with User Data ---
  // Agar user ke paas pehle se accounts hain, toh wo dikhao, nahi toh ek empty form
  const [emailAccounts, setEmailAccounts] = useState(
    user?.emailAccounts?.length > 0
      ? user.emailAccounts
      : [{ email: "", googleAppPassword: "" }]
  );

  // User update hone par (e.g. refresh ke baad) local state sync karo
  useEffect(() => {
    // Agar user object hai, toh uska emailAccounts set karo (chahe empty ho ya bhara hua)
    if (user && user.emailAccounts) {
      setEmailAccounts(user.emailAccounts);
    }
  }, [user]);

  const handleAccountChange = (index, field, value) => {
    const updatedAccounts = [...emailAccounts];
    // Ensure object exists at index
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

  return (
    <div className="w-full bg-background p-4 md:p-8 flex justify-center items-start">
      <Toaster position="top-center" />

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-border-custom overflow-hidden">
        <div className="h-3 bg-primary w-full"></div>

        <div className="p-8">
          {/* Header section... */}
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <HiOutlineUserCircle size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-primary tracking-tight">
                Profile Settings
              </h1>
              <p className="text-text-sub text-sm font-medium">
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
                <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2 ml-1">
                  Login Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub group-focus-within:text-accent transition-colors">
                    <HiOutlineEnvelope size={22} />
                  </div>
                  <input
                    disabled
                    readOnly
                    type="email"
                    value={loginMail}
                    className="w-full bg-gray-50 text-text-main font-bold pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none"
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
                <span className="text-xs text-text-sub bg-gray-100 px-2 py-1 rounded-md">
                  SMTP Setup
                </span>
              </div>

              <div className="space-y-4">
                {emailAccounts.map((account, index) => (
                  <div
                    key={index}
                    className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow relative group/card"
                  >
                    {emailAccounts.length > 1 && (
                      <button
                        onClick={() => handleRemoveAccount(index)}
                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <HiTrash size={20} />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Sending Email Input */}
                      <div>
                        <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2 ml-1">
                          Sending Email {index + 1}
                        </label>
                        <div className="relative group">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub group-focus-within:text-primary transition-colors">
                            <HiOutlineEnvelope size={20} />
                          </div>
                          <input
                            type="email"
                            // --- FIX 3: Correct Value Binding ---
                            value={account.email}
                            onChange={(e) =>
                              handleAccountChange(
                                index,
                                "email",
                                e.target.value
                              )
                            }
                            placeholder="sender@gmail.com"
                            className="w-full bg-white text-primary font-medium pl-10 pr-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                          />
                        </div>
                      </div>

                      {/* Google App Password Input */}
                      <div>
                        <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2 ml-1">
                          Google App Password
                        </label>
                        <div className="relative group">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub group-focus-within:text-primary transition-colors">
                            <HiOutlineKey size={20} />
                          </div>
                          <input
                            type="text" // Password field ko 'text' rakha hai taaki edit karte waqt dikhe (optional: 'password' bhi kar sakte ho)
                            // --- FIX 4: Correct Value Binding ---
                            value={account.googleAppPassword || ""}
                            onChange={(e) =>
                              // --- FIX 5: Correct Key Name ("googleAppPassword") ---
                              handleAccountChange(
                                index,
                                "googleAppPassword",
                                e.target.value
                              )
                            }
                            placeholder="xxxx xxxx xxxx xxxx"
                            className="w-full bg-white text-primary font-medium pl-10 pr-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddAccount}
                className="mt-4 w-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-accent hover:text-accent font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-accent/5"
              >
                <HiPlus size={20} />
                <span>Add Another Sending Account</span>
              </button>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
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
