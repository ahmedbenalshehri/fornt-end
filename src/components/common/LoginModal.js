"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import {
  RiCloseLine,
  RiMailLine,
  RiLock2Line,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext";

export default function LoginModal({
  isOpen,
  onClose,
  onSubmit,
  onSwitchToRegister,
  isSubmitting,
  onGoogleLogin,
}) {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) onClose?.();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setErrors({});
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!email)
      newErrors.email = t("form.errors.email_required", "Email is required");
    if (!password)
      newErrors.password = t("auth.password_required", "Password is required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await login(email, password);
      if (result.success) {
        if (onSubmit) await onSubmit({ email, password });
        onClose();
      } else {
        setErrors({
          general:
            result.error ||
            t("auth.login_failed", "Login failed. Please try again."),
        });
      }
    } catch (error) {
      setErrors({
        general:
          error.message ||
          t("auth.login_failed", "Login failed. Please try again."),
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await (onGoogleLogin ? onGoogleLogin() : Promise.resolve());
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end h-screen">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className={`
          relative w-full h-full sm:h-screen sm:max-w-md 
          bg-white sm:shadow-2xl 
          transform transition-all duration-300 animate-in fade-in-90 slide-in-from-bottom-4
          flex flex-col
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 sm:top-6 sm:right-6"
          aria-label={t("common.close", "Close")}
        >
          <RiCloseLine className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center justify-center pt-12 sm:pt-8 px-6">
          <Image
            src="/logo.png"
            alt="logo"
            width={100}
            height={100}
            className=""
          />
          <h2 className="text-2xl font-bold text-gray-800">
            {t("auth.login_title", "تسجيل الدخول")}
          </h2>
          <p className="text-gray-600 text-sm text-center mt-2">
            {t("auth.login_subtitle", "مرحبا بعودتك! يرجى إدخال التفاصيل")}
          </p>
        </div>

        {/* Form */}
        <div className="flex-1 px-6 py-6 overflow-y-auto sm:overflow-visible">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                {errors.general}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("contact.form.email", "البريد الإلكتروني")}
              </label>
              <div className="relative">
                <RiMailLine
                  className={`absolute ${
                    isRTL ? "right-4" : "left-4"
                  } top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full ${
                    isRTL ? "pr-12 pl-4" : "pl-12 pr-4"
                  } py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none`}
                  placeholder="example@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("auth.password", "كلمة المرور")}
              </label>
              <div className="relative">
                <RiLock2Line
                  className={`absolute ${
                    isRTL ? "right-4" : "left-4"
                  } top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full ${
                    isRTL ? "pr-12 pl-12" : "pl-12 pr-12"
                  } py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${
                    isRTL ? "left-4" : "right-4"
                  } top-1/2 -translate-y-1/2 text-gray-400`}
                >
                  {showPassword ? (
                    <RiEyeOffLine className="w-5 h-5" />
                  ) : (
                    <RiEyeLine className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
              >
                {t("auth.forgot_password", "هل نسيت كلمة المرور؟")}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-70"
            >
              {isSubmitting
                ? t("common.loading", "Loading...")
                : t("common.login", "تسجيل الدخول")}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center py-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-3 text-sm text-gray-500">
              {t("auth.or", "or")}
            </span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Google login */}

          {/* <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border rounded-xl py-3 font-medium hover:bg-gray-50 transition"
          >
            <FcGoogle className="w-5 h-5" />
            <span>{t("auth.login_with_google", "تسجيل الدخول بـ Google")}</span>
          </button> */}

          {/* Switch to register */}
          <p className="text-center text-sm text-gray-600 mt-6">
            {t("auth.dont_have_account", "ليس لديك حساب؟")}{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:underline font-semibold"
            >
              {t("auth.create_account", "إنشاء حساب")}
            </button>
          </p>
        </div>
      </div>
    </div>,
    typeof window !== "undefined"
      ? document.body
      : document.createElement("div")
  );
}
