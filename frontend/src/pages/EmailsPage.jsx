import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiPencilSquare,
  HiTrash,
  HiOutlineEnvelope,
  HiPlus,
  HiArrowUpTray,
  HiXMark,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { getSubEmails } from "../redux/emailSlice";

export default function EmailsPage() {
  const dispatch = useDispatch();

  const { subEmails, isLoading } = useSelector((state) => state.email);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [displayEmails, setDisplayEmails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    groupName: "general",
    email: "",
  });

  useEffect(() => {
    dispatch(getSubEmails());
  }, [dispatch]);

  useEffect(() => {
    if (subEmails && subEmails.length > 0) {
      setSelectedGroup(subEmails[0].groupName);
      setDisplayEmails(subEmails[0].emails);
    }
  }, [subEmails]);

  const handleGroupChange = (e) => {
    const groupName = e.target.value;
    setSelectedGroup(groupName);
    const groupData = subEmails.find((item) => item.groupName === groupName);
    setDisplayEmails(groupData ? groupData.emails : []);
  };

  const handleDelete = (emailToDelete) => {
    if (window.confirm(`Delete ${emailToDelete}?`)) {
      setDisplayEmails(
        displayEmails.filter((email) => email !== emailToDelete),
      );
      toast.success("Email removed from list");
    }
  };

  const handleAddEmailSubmit = (e) => {
    e.preventDefault();
    console.log("Adding Email:", formData);
    toast.success("Email added successfully!");
    setIsModalOpen(false);
    setFormData({ groupName: "general", email: "" });
  };

  return (
    <div
      className="w-full p-6 min-h-screen relative"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <Toaster position="top-center" />

      {/* --- ADD EMAIL MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-4xl shadow-2xl overflow-hidden transform transition-all"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            {/* Modal Header */}
            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold tracking-tight">
                  Add New Email
                </h3>
                <p className="text-xs opacity-80">Single Entry Mode</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <HiXMark size={24} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAddEmailSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label
                  className="text-sm font-bold ml-1"
                  style={{ color: "var(--color-text)" }}
                >
                  Group Name
                </label>
                <input
                  type="text"
                  value={formData.groupName}
                  onChange={(e) =>
                    setFormData({ ...formData, groupName: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl outline-none transition-all font-semibold border"
                  style={{
                    backgroundColor: "var(--color-surface-alt)",
                    color: "var(--color-text)",
                    borderColor: "var(--color-border)",
                  }}
                  placeholder="e.g. general, work"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-bold ml-1"
                  style={{ color: "var(--color-text)" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <HiOutlineEnvelope
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    size={20}
                    style={{ color: "var(--color-text-sub)" }}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-12 p-4 rounded-2xl outline-none transition-all font-semibold border"
                    style={{
                      backgroundColor: "var(--color-surface-alt)",
                      color: "var(--color-text)",
                      borderColor: "var(--color-border)",
                    }}
                    placeholder="example@mail.com"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 font-bold rounded-2xl transition-all active:scale-95"
                  style={{
                    backgroundColor: "var(--color-surface-alt)",
                    color: "var(--color-text-sub)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-border)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-surface-alt)";
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  Save Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TABLE SECTION --- */}
      <div
        className="w-full rounded-3xl shadow-xl overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="h-2 bg-primary w-full"></div>

        {/* Toolbar */}
        <div
          className="p-6 border-b flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div>
            <h2 className="text-2xl font-extrabold text-primary tracking-tight">
              Email Manager
            </h2>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--color-text-sub)" }}
            >
              Group:{" "}
              <span className="text-primary capitalize">{selectedGroup}</span> (
              {displayEmails.length} emails)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select
              value={selectedGroup}
              onChange={handleGroupChange}
              className="text-sm rounded-xl focus:ring-primary focus:border-primary block p-2.5 font-bold outline-none cursor-pointer border"
              style={{
                backgroundColor: "var(--color-surface-alt)",
                color: "var(--color-text)",
                borderColor: "var(--color-border)",
              }}
            >
              {subEmails?.map((group) => (
                <option key={group._id} value={group.groupName}>
                  📂 {group.groupName.toUpperCase()}
                </option>
              ))}
            </select>

            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-200/30 transition-all active:scale-95 flex items-center gap-2 text-sm">
              <HiArrowUpTray size={18} /> Import CSV
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 text-sm"
            >
              <HiPlus size={18} /> Add Email
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--color-surface-alt)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <th
                  className="p-5 text-xs font-bold uppercase tracking-wider w-16 text-center"
                  style={{ color: "var(--color-text-sub)" }}
                >
                  #
                </th>
                <th
                  className="p-5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--color-text-sub)" }}
                >
                  Email Address
                </th>
                <th
                  className="p-5 text-xs font-bold uppercase tracking-wider text-right"
                  style={{ color: "var(--color-text-sub)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="p-8 text-center text-primary animate-pulse font-bold"
                  >
                    Loading emails...
                  </td>
                </tr>
              ) : displayEmails.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="p-8 text-center font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    No emails found in this group.
                  </td>
                </tr>
              ) : (
                displayEmails.map((email, index) => (
                  <tr
                    key={index}
                    className="group transition-colors duration-200"
                    style={{ borderBottom: "1px solid var(--color-border)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--color-surface-alt)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td
                      className="p-5 text-center font-bold"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {index + 1}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <HiOutlineEnvelope />
                        </div>
                        <span
                          className="font-bold text-sm"
                          style={{ color: "var(--color-text)" }}
                        >
                          {email}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-blue-500 hover:bg-blue-100/20 rounded-lg transition-colors">
                          <HiPencilSquare size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(email)}
                          className="p-2 text-red-400 hover:bg-red-100/20 rounded-lg transition-colors"
                        >
                          <HiTrash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
