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

  useEffect(() => {
    if (user?.emailAccounts?.length > 0 && !form.from) {
      setForm((prev) => ({ ...prev, from: user.emailAccounts[0].email }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
        bcc: group.emails,
        to: "",
      }));
      toast.success(`${group.emails.length} emails added from ${group.groupName}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Email process started!");

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

  const inputStyle = {
    backgroundColor: "var(--color-surface-alt)",
    color: "var(--color-text)",
    borderColor: "var(--color-border)",
  };

  const toggleTabStyle = (active) => ({
    backgroundColor: active ? "var(--color-surface)" : "transparent",
    color: active ? "var(--brand-primary)" : "var(--color-text-muted)",
    boxShadow: active ? "0 1px 3px var(--color-shadow)" : "none",
  });

  return (
    <div
      className="min-h-screen w-full p-4 md:p-8 flex justify-center items-start"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <Toaster position="top-center" />

      <div
        className="w-full max-w-3xl rounded-3xl shadow-xl overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Top Strip */}
        <div className="h-3 bg-primary w-full"></div>

        <div className="p-8">
          {/* Header */}
          <div
            className="flex items-center gap-4 mb-8 border-b pb-6"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center text-accent">
              <HiPaperAirplane size={28} className="-rotate-45 translate-x-1" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-primary tracking-tight">
                Compose Email
              </h1>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-sub)" }}>
                Send a new message to your subscribers.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: From & To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FROM */}
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1"
                  style={{ color: "var(--color-text-sub)" }}
                >
                  From Account
                </label>
                <div className="relative">
                  <select
                    name="from"
                    value={form.from}
                    onChange={handleChange}
                    className="w-full font-bold px-4 py-3 rounded-xl border outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all appearance-none cursor-pointer"
                    style={inputStyle}
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
                  <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--color-text-sub)" }}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* RECIPIENT */}
              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label
                    className="block text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--color-text-sub)" }}
                  >
                    Recipient {recipientType === "individual" ? "To" : "BCC"}
                  </label>

                  {/* Toggle Switch */}
                  <div
                    className="flex p-0.5 rounded-lg"
                    style={{ backgroundColor: "var(--color-surface-alt)" }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setRecipientType("individual");
                        setSelectedGroupId("");
                        setForm((prev) => ({ ...prev, bcc: [] }));
                      }}
                      className="px-2 py-0.5 text-[10px] font-bold rounded-md transition-all flex items-center gap-1"
                      style={toggleTabStyle(recipientType === "individual")}
                    >
                      <HiUser size={12} /> Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRecipientType("group");
                        setForm((prev) => ({ ...prev, to: "" }));
                      }}
                      className="px-2 py-0.5 text-[10px] font-bold rounded-md transition-all flex items-center gap-1"
                      style={toggleTabStyle(recipientType === "group")}
                    >
                      <HiUserGroup size={12} /> Group
                    </button>
                  </div>
                </div>

                <div className="relative group">
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "var(--color-text-sub)" }}
                  >
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
                      className="w-full font-medium pl-11 pr-4 py-3 rounded-xl border outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                      style={inputStyle}
                    />
                  ) : (
                    <div className="relative">
                      <select
                        value={selectedGroupId}
                        onChange={handleGroupChange}
                        className="w-full font-medium pl-11 pr-4 py-3 rounded-xl border outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all appearance-none cursor-pointer"
                        style={inputStyle}
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
                      <div
                        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "var(--color-text-sub)" }}
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
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
              <label
                className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1"
                style={{ color: "var(--color-text-sub)" }}
              >
                Subject
              </label>
              <input
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                placeholder="Enter email subject..."
                className="w-full font-bold px-4 py-3 rounded-xl border outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                style={inputStyle}
                required
              />
            </div>

            {/* MESSAGE BODY */}
            <div>
              <div className="flex justify-between items-end mb-2 ml-1">
                <label
                  className="block text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--color-text-sub)" }}
                >
                  Message Body
                </label>
                <div
                  className="flex p-1 rounded-lg"
                  style={{ backgroundColor: "var(--color-surface-alt)" }}
                >
                  <button
                    type="button"
                    onClick={() => setEditorMode("text")}
                    className="px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1"
                    style={toggleTabStyle(editorMode === "text")}
                  >
                    <HiOutlineDocumentText size={14} /> Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode("html")}
                    className="px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1"
                    style={toggleTabStyle(editorMode === "html")}
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
                  className="w-full font-medium px-4 py-3 rounded-xl border outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all resize-none"
                  style={inputStyle}
                />
              ) : (
                /* HTML editor keeps a dark code-editor aesthetic in both modes */
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
            <div
              className="pt-4 border-t flex justify-end"
              style={{ borderColor: "var(--color-border)" }}
            >
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
