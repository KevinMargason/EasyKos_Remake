"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { ROLE_HOME, ROUTES, normalizeRole } from "@/lib/routes";
import { useAppDispatch } from "@/core/store/hooks";
import { setUser } from "@/core/feature/user/userSlice";
import { setRole } from "@/core/feature/role/roleSlice";
import { api } from "@/core/services/api";

const loginSchema = Yup.object({
  email: Yup.string().email('Email harus valid').required("Email harus diisi"),
  password: Yup.string()
    .min(8, "Password minimal 8 karakter")
    .required("Password harus diisi"),
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        console.log('Logging in with:', { email: values.email });
        const response = await api.auth.login({
          email: values.email,
          password: values.password,
        });

        if (response && (response.access_token || response.success)) {
          const { access_token, user } = response;
          
          // Store token
          if (typeof window !== "undefined") {
            localStorage.setItem("token", access_token);
            localStorage.setItem("role", user.role);
          }
          
          // Update Redux store
          dispatch(setUser(user));
          dispatch(setRole(user.role));
          
          toast.success(`Selamat datang, ${user.name}!`);
          
          // Redirect based on role
          const normalizedRole = normalizeRole(user.role);
          const targetRoute = normalizedRole ? ROLE_HOME[normalizedRole] : ROUTES.USER.HOME;
          router.push(targetRoute);
        }
      } catch (error: any) {
        console.error("Login Error:", error);
        const errorMsg = error?.response?.data?.message || error?.response?.data?.error || `Login gagal: ${error?.message}`;
        toast.error(errorMsg);
      }
    },
  });

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    isSubmitting,
  } = formik;

  return (
    <div className="min-h-screen bg-[linear-gradient(225deg,#f5c9c2_0%,#fae4e1_30%,#fdf3f1_65%,#ffffff_95%)] px-4 py-10 dark:bg-[linear-gradient(225deg,#2d1512_0%,#1e1a2e_40%,#111827_70%,#0f172a_100%)] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[980px] items-center justify-center">
        <div className="glass-card animate-fade-in-up w-full max-w-[570px] rounded-[20px] px-7 py-8 sm:px-10 sm:py-9">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 text-[15px] text-[#7e6a66] transition hover:text-[#BA6054] dark:text-slate-400 dark:hover:text-[#e07b6d]"
          >
            <ArrowLeft size={16} />
            Kembali ke beranda
          </Link>
          <h1 className="mt-3 text-[34px] font-bold leading-none text-[#BA6054] sm:text-[44px] md:text-[52px]">Masuk</h1>

          <form className="mt-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="text-[17px] font-medium text-[#1f1f1f] dark:text-slate-200">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Masukkan email Anda"
                className={`mt-1 w-full border-0 border-b bg-transparent pb-2 text-[24px] text-[#1f1f1f] placeholder:text-[#b7b7b7] transition-colors duration-200 focus:border-b focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500 sm:text-[30px] md:text-[34px] ${
                  touched.email && errors.email ? "border-[#BA6054]" : "border-[#b9b9b9] focus:border-[#BA6054] dark:border-slate-600 dark:focus:border-[#e07b6d]"
                }`}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-[#db6c64]">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mt-4">
              <label htmlFor="password" className="text-[17px] font-medium text-[#1f1f1f] dark:text-slate-200">
                Password
              </label>
              <div className={`mt-1 flex items-center border-0 border-b pb-2 ${touched.password && errors.password ? "border-[#BA6054]" : "border-[#b9b9b9] dark:border-slate-600"}`}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  className="w-full bg-transparent text-[24px] text-[#1f1f1f] placeholder:text-[#b7b7b7] transition-colors duration-200 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500 sm:text-[30px] md:text-[34px]"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  aria-label="Tampilkan password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[#101827] dark:text-slate-400"
                >
                  {showPassword ? <Eye size={26} /> : <EyeOff size={26} />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1 text-xs text-[#db6c64]">{errors.password}</p>
              )}
            </div>

            <div className="mt-2 text-right">
              <button type="button" className="text-[16px] text-[#BA6054] hover:opacity-75">
                Lupa password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 h-[54px] w-full rounded-full bg-[linear-gradient(to_right,#E2B0A9_0%,#BA6054_100%)] text-[26px] font-medium text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(186,96,84,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:h-[61px] sm:text-[36px] md:text-[42px]"
            >
              {isSubmitting ? "Memuat..." : "Masuk"}
            </button>

            <div className="mt-7 text-center text-[17px] text-[#244454] dark:text-slate-400">
              Belum punya akun?{" "}
              <Link href={ROUTES.REGISTER} className="font-medium text-[#BA6054] hover:opacity-75 dark:text-[#e07b6d]">
                Daftar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
