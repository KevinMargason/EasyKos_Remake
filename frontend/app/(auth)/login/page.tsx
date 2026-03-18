"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { setToken } from "@/core/feature/token/tokenSlice";
import { setUser } from "@/core/feature/user/userSlice";
import { setRole } from "@/core/feature/role/roleSlice";
import { api } from "@/lib/api";

const loginSchema = Yup.object({
  no_hp: Yup.string().required("E-mail address harus diisi"),
  pin: Yup.string()
    .min(6, "Password minimal 6 karakter")
    .required("Password harus diisi"),
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPin, setShowPin] = useState(false);
  const formik = useFormik({
    initialValues: {
      no_hp: "",
      pin: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const response = await api.login(values.no_hp, values.pin);
        const access_token = response.data.token;
        const userData = response.data.user;
        const role = userData.role; // 'owner', 'tenant', atau 'admin'

        if (access_token) {
          const expiresIn = 7 * 24 * 60 * 60;
          dispatch(setToken({ token: access_token, expiresIn }));
          dispatch(setUser(userData)); // Simpan object user lengkap atau nama saja
          dispatch(setRole(role));

          // 2. Simpan ke LocalStorage (untuk persistency)
          localStorage.setItem("token", access_token);
          localStorage.setItem("user_role", role);

          toast.success(`Selamat datang, ${userData.nama}!`);

          // 3. Logika Redirect Berdasarkan Role Database
          const urlParams = new URLSearchParams(window.location.search);
          const fromPath = urlParams.get("from");

          if (fromPath && fromPath.startsWith("/")) {
            router.push(fromPath);
          } else {
            switch (role) {
              case "owner":
                router.push("/dashboard"); // Halaman utama Owner
                break;
              case "admin":
                router.push("/admin"); // Halaman Admin
                break;
              case "tenant":
                router.push("/"); // Halaman Tenant/Penyewa
                break;
              default:
                router.push("/"); // Default fallback
                break;
            }
          }
        } else {
          throw new Error("Token tidak ditemukan dalam respon server.");
        }
      } catch (error) {
        console.error("Login Error:", error);
        // Menangani error message dari response API atau error umum
        //const errMsg =
        //  error?.response?.data?.message ||
        //  error?.message ||
        //  "Login gagal, periksa koneksi atau kredensial.";
        const errMsg = "Login gagal, periksa koneksi atau kredensial.";
         toast.error(errMsg);
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
            href="/"
            className="inline-flex items-center gap-1.5 text-[15px] text-[#7e6a66] transition hover:text-[#BA6054] dark:text-slate-400 dark:hover:text-[#e07b6d]"
          >
            <ArrowLeft size={16} />
            Back to homepage
          </Link>
          <h1 className="mt-3 text-[34px] font-bold leading-none text-[#BA6054] sm:text-[44px] md:text-[52px]">Login</h1>

          <form className="mt-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="no_hp" className="text-[17px] font-medium text-[#1f1f1f] dark:text-slate-200">
                E-mail address
              </label>
              <input
                id="no_hp"
                name="no_hp"
                type="text"
                placeholder="Enter Email"
                className={`mt-1 w-full border-0 border-b bg-transparent pb-2 text-[24px] text-[#1f1f1f] placeholder:text-[#b7b7b7] transition-colors duration-200 focus:border-b focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500 sm:text-[30px] md:text-[34px] ${
                  touched.no_hp && errors.no_hp ? "border-[#BA6054]" : "border-[#b9b9b9] focus:border-[#BA6054] dark:border-slate-600 dark:focus:border-[#e07b6d]"
                }`}
                value={values.no_hp}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.no_hp && errors.no_hp && (
                <p className="mt-1 text-xs text-[#db6c64]">{errors.no_hp}</p>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="pin" className="text-[17px] font-medium text-[#1f1f1f] dark:text-slate-200">
                Password
              </label>
              <div className={`mt-1 flex items-center border-0 border-b pb-2 ${touched.pin && errors.pin ? "border-[#BA6054]" : "border-[#b9b9b9] dark:border-slate-600"}`}>
                <input
                  id="pin"
                  name="pin"
                  type={showPin ? "text" : "password"}
                  placeholder="Enter Password"
                  className="w-full bg-transparent text-[24px] text-[#1f1f1f] placeholder:text-[#b7b7b7] transition-colors duration-200 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500 sm:text-[30px] md:text-[34px]"
                  value={values.pin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  aria-label="Show password"
                  onClick={() => setShowPin((prev) => !prev)}
                  className="text-[#101827] dark:text-slate-400"
                >
                  {showPin ? <Eye size={26} /> : <EyeOff size={26} />}
                </button>
              </div>
              {touched.pin && errors.pin && (
                <p className="mt-1 text-xs text-[#db6c64]">{errors.pin}</p>
              )}
            </div>

            <div className="mt-2 text-right">
              <button type="button" className="text-[16px] text-[#BA6054] hover:opacity-75">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 h-[54px] w-full rounded-full bg-[linear-gradient(to_right,#E2B0A9_0%,#BA6054_100%)] text-[26px] font-medium text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(186,96,84,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:h-[61px] sm:text-[36px] md:text-[42px]"
            >
              {isSubmitting ? "Loading..." : "Login"}
            </button>

            <div className="mt-7 text-center text-[17px] text-[#244454] dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-[#BA6054] hover:opacity-75 dark:text-[#e07b6d]">
                Sign Up
              </Link>
            </div>
          </form>
          </div>
      </div>
    </div>
  );
}
