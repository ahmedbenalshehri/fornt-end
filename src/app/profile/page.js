"use client";

import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RiUserLine,
  RiMailLine,
  RiPhoneLine,
  RiSettingsLine,
  RiLogoutBoxLine,
  RiEditLine,
  RiShieldLine,
  RiNotificationLine,
  RiGlobalLine,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";

export default function ProfilePage() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement profile update API call
    console.log("Update profile:", editForm);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("profile.not_authenticated", "Not Authenticated")}
          </h2>
          <p className="text-gray-600 mb-4">
            {t("profile.please_login", "Please log in to view your profile")}
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("common.go_home", "Go Home")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <RiUserLine className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : t("profile.welcome", "Welcome")}
                </h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RiEditLine className="w-4 h-4" />
              <span>
                {isEditing
                  ? t("common.cancel", "Cancel")
                  : t("common.edit", "Edit")}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <RiUserLine className="w-5 h-5 mr-2" />
                {t("profile.personal_info", "Personal Information")}
              </h2>

              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("profile.first_name", "First Name")}
                      </label>
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("profile.last_name", "Last Name")}
                      </label>
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("profile.phone", "Phone Number")}
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {t("common.save", "Save Changes")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      {t("common.cancel", "Cancel")}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <RiUserLine className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("profile.first_name", "First Name")}
                        </p>
                        <p className="font-medium text-gray-800">
                          {user.firstName ||
                            t("common.not_provided", "Not provided")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RiUserLine className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("profile.last_name", "Last Name")}
                        </p>
                        <p className="font-medium text-gray-800">
                          {user.lastName ||
                            t("common.not_provided", "Not provided")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RiMailLine className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("profile.email", "Email Address")}
                      </p>
                      <p className="font-medium text-gray-800">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RiPhoneLine className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("profile.phone", "Phone Number")}
                      </p>
                      <p className="font-medium text-gray-800">
                        {user.phone || t("common.not_provided", "Not provided")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preferences & Actions */}
          <div className="space-y-6">
            {/* Preferences */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <RiSettingsLine className="w-5 h-5 mr-2" />
                {t("profile.preferences", "Preferences")}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <RiGlobalLine className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {t("profile.language", "Language")}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {user.preferences?.language?.toUpperCase() || "EN"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <RiMoneyDollarCircleLine className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {t("profile.currency", "Currency")}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {user.preferences?.currency || "SAR"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <RiNotificationLine className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {t("profile.email_notifications", "Email Notifications")}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {user.preferences?.notifications?.email
                      ? t("common.on", "On")
                      : t("common.off", "Off")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <RiNotificationLine className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {t("profile.sms_notifications", "SMS Notifications")}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {user.preferences?.notifications?.sms
                      ? t("common.on", "On")
                      : t("common.off", "Off")}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <RiShieldLine className="w-5 h-5 mr-2" />
                {t("profile.account_actions", "Account Actions")}
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    // TODO: Implement change password functionality
                    console.log("Change password clicked");
                  }}
                  className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <RiShieldLine className="w-5 h-5 text-gray-400" />
                  <span>{t("profile.change_password", "Change Password")}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <RiLogoutBoxLine className="w-5 h-5" />
                  <span>{t("profile.logout", "Logout")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
