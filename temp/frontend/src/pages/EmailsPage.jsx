import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiPencilSquare,
  HiTrash,
  HiOutlineEnvelope,
  HiPlus,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { getSubEmails } from "../redux/emailSlice";
import { useEffect } from "react";

export default function EmailTable() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSubEmails());
  }, [dispatch]);

  const { subEmails, isLoading, error } = useSelector((state) => state.email);

  // --- MOCK DATA (Role removed) ---
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    setEmails(subEmails);
  }, [subEmails]);

  // --- HANDLERS ---
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this email?")) {
      setEmails(emails.filter((item) => item.id !== id));
      toast.success("Email deleted successfully");
    }
  };

  const handleUpdate = (id) => {
    toast("Update Modal would open here", { icon: "✏️" });
  };

  return (
    <div className="w-full bg-background p-6">
      <Toaster position="top-center" />

      {/* Card Container */}
      <div className="w-full bg-white rounded-3xl shadow-xl border border-border-custom overflow-hidden">
        {/* Header Strip */}
        <div className="h-2 bg-primary w-full"></div>

        {/* Table Header / Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-primary tracking-tight">
              Email List
            </h2>
            <p className="text-sm text-text-sub font-medium">
              Manage your registered sending accounts.
            </p>
          </div>

          <button className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 text-sm">
            <HiPlus size={18} />
            Add New Email
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {/* 1. Index Header */}
                <th className="p-5 text-xs font-bold text-text-sub uppercase tracking-wider w-16 text-center">
                  #
                </th>
                {/* 2. Email Header */}
                <th className="p-5 text-xs font-bold text-text-sub uppercase tracking-wider">
                  Email Address
                </th>
                {/* 3. Actions Header */}
                <th className="p-5 text-xs font-bold text-text-sub uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {emails.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="p-8 text-center text-gray-400 font-medium"
                  >
                    No emails found.
                  </td>
                </tr>
              ) : (
                emails.map((item, index) => (
                  <tr
                    key={index + 1}
                    className="group hover:bg-blue-50/50 transition-colors duration-200"
                  >
                    {/* Index Column */}
                    <td className="p-5 text-center font-bold text-gray-400">
                      {index + 1}
                    </td>

                    {/* Email Column */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-colors">
                          <HiOutlineEnvelope />
                        </div>
                        <span className="font-bold text-text-main text-sm">
                          {item}
                        </span>
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Update"
                        >
                          <HiPencilSquare size={20} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-400 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete"
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

        {/* Pagination Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-text-sub">
          <span>Showing {emails.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-gray-200 rounded hover:border-accent transition-colors">
              Prev
            </button>
            <button className="px-3 py-1 bg-white border border-gray-200 rounded hover:border-accent transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
