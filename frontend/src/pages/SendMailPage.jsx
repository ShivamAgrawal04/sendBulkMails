import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiPaperAirplane,
  HiOutlineEnvelope,
  HiOutlineDocumentText,
  HiOutlineCodeBracket,
  HiUserGroup,
  HiUser,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { sendEmail } from "../redux/emailSlice";

export default function SendMailPage() {
  // Logic from Code 2: Getting state
  const { user } = useSelector((state) => state.auth);
  const { subEmails } = useSelector((state) => state.email);

  const [form, setForm] = useState({
    from: "",
    to: "",
    bcc: [],
    subject: "",
    text: "",
    html: "",
  });

  const {} = useSelector((state) => state.email);

  const dispatch = useDispatch();

  const handleSendEmail = (e) => {
    e.preventDefault();
    dispatch(sendEmail(form));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [editorMode, setEditorMode] = useState("text");
  const [recipientType, setRecipientType] = useState("individual");
  const [selectedGroupId, setSelectedGroupId] = useState("");

  // Logic from Code 2: Set default sender when user is available
  useEffect(() => {
    if (user?.emailAccounts?.length > 0 && !form.from) {
      setForm((prev) => ({ ...prev, from: user.emailAccounts[0].email }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Logic from Code 2: Handle Group Selection
  const handleGroupChange = (e) => {
    const groupId = e.target.value;
    setSelectedGroupId(groupId);

    if (!groupId) {
      setForm((prev) => ({ ...prev, bcc: [] }));
      return;
    }

    const group = subEmails.find((g) => g._id === groupId);
    if (group) {
      setForm((prev) => ({
        ...prev,
        bcc: group.emails, // Array of email strings
        to: "", // Clear individual recipient
      }));
      toast.success(
        `${group.emails.length} emails added from ${group.groupName}`
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Logic from Code 2: Validation & Payload
    if (!form.from) return toast.error("Please select a sender email.");
    if (recipientType === "individual" && !form.to)
      return toast.error("Please enter a recipient email.");
    if (recipientType === "group" && (!form.bcc || form.bcc.length === 0))
      return toast.error("Please select a valid group.");

    setIsLoading(true);

    const payload = {
      from: form.from,
      subject: form.subject,
      text: form.text,
      html: form.html,
      to: recipientType === "individual" ? form.to : undefined,
      bcc: recipientType === "group" ? form.bcc : undefined,
    };

    console.log("FINAL PAYLOAD:", payload);

    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Email process started!");

      // Reset logic
      setForm((prev) => ({
        ...prev,
        to: "",
        bcc: [],
        subject: "",
        text: "",
        html: "",
      }));
      setSelectedGroupId("");
    }, 1500);
  };

  // UI Design from Code 1
  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8 flex justify-center items-start">
      <Toaster position="top-center" />

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-border-custom overflow-hidden">
        {/* Top Strip */}
        <div className="h-3 bg-primary w-full"></div>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
            <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center text-accent">
              <HiPaperAirplane size={28} className="-rotate-45 translate-x-1" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-primary tracking-tight">
                Compose Email
              </h1>
              <p className="text-text-sub text-sm font-medium">
                Send a new message to your subscribers.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: From & To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FROM - Design from Code 1, functionality from Code 2 */}
              <div>
                <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2 ml-1">
                  From Account
                </label>
                <div className="relative">
                  <select
                    name="from"
                    value={form.from}
                    onChange={handleChange}
                    className="w-full bg-gray-50 text-primary font-bold px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all appearance-none cursor-pointer"
                  >
                    {user?.emailAccounts?.length > 0 ? (
                      user.emailAccounts.map((account, index) => (
                        <option key={index} value={account.email}>
                          {account.email}
                        </option>
                      ))
                    ) : (
                      <option value="">No accounts available</option>
                    )}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-sub">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* RECIPIENT - Design from Code 1, functionality from Code 2 */}
              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-xs font-bold text-text-sub uppercase tracking-wider">
                    Recipient {recipientType === "individual" ? "To" : "BCC"}
                  </label>

                  {/* Toggle Switch */}
                  <div className="flex bg-gray-100 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setRecipientType("individual");
                        setSelectedGroupId("");
                        setForm((prev) => ({ ...prev, bcc: [] }));
                      }}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 ${
                        recipientType === "individual"
                          ? "bg-white text-primary shadow-sm"
                          : "text-gray-400 hover:text-primary"
                      }`}
                    >
                      <HiUser size={12} /> Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRecipientType("group");
                        setForm((prev) => ({ ...prev, to: "" }));
                      }}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 ${
                        recipientType === "group"
                          ? "bg-white text-primary shadow-sm"
                          : "text-gray-400 hover:text-primary"
                      }`}
                    >
                      <HiUserGroup size={12} /> Group
                    </button>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub group-focus-within:text-accent transition-colors">
                    {recipientType === "individual" ? (
                      <HiOutlineEnvelope size={22} />
                    ) : (
                      <HiUserGroup size={22} />
                    )}
                  </div>

                  {recipientType === "individual" ? (
                    <input
                      name="to"
                      type="email"
                      value={form.to}
                      onChange={handleChange}
                      placeholder="recipient@example.com"
                      className="w-full bg-gray-50 text-text-main font-medium pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-gray-400"
                    />
                  ) : (
                    <div className="relative">
                      <select
                        value={selectedGroupId}
                        onChange={handleGroupChange}
                        className="w-full bg-gray-50 text-text-main font-medium pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Select a Group
                        </option>
                        {subEmails &&
                          subEmails.map((group) => (
                            <option key={group._id} value={group._id}>
                              {group.groupName} ({group.emails.length})
                            </option>
                          ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-sub">
                        <svg
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SUBJECT */}
            <div>
              <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2 ml-1">
                Subject
              </label>
              <input
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                placeholder="Enter email subject..."
                className="w-full bg-gray-50 text-text-main font-bold px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-gray-400"
                required
              />
            </div>

            {/* MESSAGE BODY */}
            <div>
              <div className="flex justify-between items-end mb-2 ml-1">
                <label className="block text-xs font-bold text-text-sub uppercase tracking-wider">
                  Message Body
                </label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setEditorMode("text")}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
                      editorMode === "text"
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-500 hover:text-primary"
                    }`}
                  >
                    <HiOutlineDocumentText size={14} /> Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode("html")}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
                      editorMode === "html"
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-500 hover:text-primary"
                    }`}
                  >
                    <HiOutlineCodeBracket size={14} /> HTML
                  </button>
                </div>
              </div>

              {editorMode === "text" ? (
                <textarea
                  name="text"
                  value={form.text}
                  onChange={handleChange}
                  placeholder="Type your plain text message here..."
                  rows={8}
                  className="w-full bg-gray-50 text-text-main font-medium px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-gray-400 resize-none"
                />
              ) : (
                <textarea
                  name="html"
                  value={form.html}
                  onChange={handleChange}
                  placeholder="<p>Type your HTML code here...</p>"
                  rows={8}
                  className="w-full bg-gray-900 text-green-400 font-mono text-sm px-4 py-3 rounded-xl border border-gray-700 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-gray-600 resize-none"
                />
              )}
            </div>

            {/* SEND BUTTON */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                onClick={handleSendEmail}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-95 flex items-center gap-2"
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <span>Send Email</span>
                    <HiPaperAirplane className="-rotate-45 translate-y-[-2px]" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
