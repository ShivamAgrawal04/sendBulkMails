import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiPaperAirplane,
  HiOutlineEnvelope,
  HiOutlineDocumentText,
  HiOutlineCodeBracket,
  HiUserGroup, // Icon for Group
  HiUser, // Icon for Individual
} from "react-icons/hi2";

export default function SendMailPage() {
  // --- MOCK DATA: Sending Accounts ---
  const savedSendingEmails = [
    "marketing@wisdora.com",
    "admin@wisdora.com",
    "support@wisdora.com",
  ];

  // --- MOCK DATA: Groups (DB se aayenge usually) ---
  const savedGroups = [
    {
      id: "g1",
      name: "Marketing Team",
      emails: ["mark1@test.com", "mark2@test.com"],
    },
    {
      id: "g2",
      name: "Developers",
      emails: ["dev1@test.com", "dev2@test.com", "dev3@test.com"],
    },
    {
      id: "g3",
      name: "Newsletter Subscribers",
      emails: ["sub1@test.com", "sub2@test.com"],
    },
  ];

  const [form, setForm] = useState({
    from: "",
    to: "",
    bcc: [], // BCC array hoga groups ke liye
    subject: "",
    text: "",
    html: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [editorMode, setEditorMode] = useState("text");

  // New State: Track kar raha hai ki user Single bhej raha hai ya Group ko
  const [recipientType, setRecipientType] = useState("individual"); // 'individual' | 'group'
  const [selectedGroupId, setSelectedGroupId] = useState(""); // UI ke liye group ID hold karega

  // --- AUTO-SELECT FROM EMAIL ---
  useEffect(() => {
    if (savedSendingEmails.length > 0) {
      setForm((prev) => ({ ...prev, from: savedSendingEmails[0] }));
    }
  }, []);

  // Handle Text Changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Group Selection
  const handleGroupChange = (e) => {
    const groupId = e.target.value;
    setSelectedGroupId(groupId);

    // Group ID se emails dhundo
    const group = savedGroups.find((g) => g.id === groupId);
    if (group) {
      // Form state mein emails set kar do
      setForm((prev) => ({ ...prev, bcc: group.emails, to: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Validation Logic
    if (!form.from) {
      toast.error("Please select a sender email.");
      return;
    }

    if (recipientType === "individual" && !form.to) {
      toast.error("Please enter a recipient email.");
      return;
    }

    if (recipientType === "group" && (!form.bcc || form.bcc.length === 0)) {
      toast.error("Please select a valid group.");
      return;
    }

    setIsLoading(true);

    // 2. Prepare Payload (Backend ko sirf relevant field bhejo)
    const payload = {
      from: form.from,
      subject: form.subject,
      text: form.text,
      html: form.html,
      // Conditional Logic:
      to: recipientType === "individual" ? form.to : undefined, // Agar group hai to 'to' undefined
      bcc: recipientType === "group" ? form.bcc : undefined, // Agar individual hai to 'bcc' undefined
    };

    console.log("FINAL PAYLOAD TO BACKEND:", payload);

    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        recipientType === "group"
          ? `Sent to group (${form.bcc.length} emails)!`
          : "Email sent successfully!"
      );

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
              {/* FROM - SMART DROPDOWN (No Changes here) */}
              <div>
                <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2 ml-1">
                  From
                </label>
                <div className="relative">
                  <select
                    name="from"
                    value={form.from}
                    onChange={handleChange}
                    className="w-full bg-gray-50 text-primary font-bold px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all appearance-none cursor-pointer"
                  >
                    {savedSendingEmails.map((email, index) => (
                      <option key={index} value={email}>
                        {email}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-sub">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* DYNAMIC TO / GROUP SECTION */}
              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-xs font-bold text-text-sub uppercase tracking-wider">
                    Recipient {recipientType === "individual" ? "To" : "BCC"}
                  </label>

                  {/* TOGGLE SWITCH: INDIVIDUAL VS GROUP */}
                  <div className="flex bg-gray-100 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setRecipientType("individual");
                        setForm((prev) => ({ ...prev, bcc: [] })); // Clear Group data
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
                        setForm((prev) => ({ ...prev, to: "" })); // Clear Individual data
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

                  {/* CONDITIONAL RENDERING */}
                  {recipientType === "individual" ? (
                    // 1. INDIVIDUAL INPUT
                    <input
                      name="to"
                      type="email"
                      value={form.to}
                      onChange={handleChange}
                      placeholder="recipient@example.com"
                      className="w-full bg-gray-50 text-text-main font-medium pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-gray-400"
                    />
                  ) : (
                    // 2. GROUP SELECT DROPDOWN
                    <div className="relative">
                      <select
                        value={selectedGroupId}
                        onChange={handleGroupChange}
                        className="w-full bg-gray-50 text-text-main font-medium pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Select a Group
                        </option>
                        {savedGroups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name} ({group.emails.length} emails)
                          </option>
                        ))}
                      </select>
                      {/* Arrow for Select */}
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

            {/* SUBJECT & BODY (Same as before) */}
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
