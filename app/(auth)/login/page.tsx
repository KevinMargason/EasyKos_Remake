"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { ROLE_HOME, ROUTES, normalizeRole } from "@/lib/routes";

const loginSchema = Yup.object({
  no_hp: Yup.string().required("Nomor HP harus diisi"),
  pin: Yup.string()
    .min(6, "Kata sandi minimal 6 karakter")
    .required("Kata sandi harus diisi"),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPin, setShowPin] = useState(false);
  const formik = useFormik({
    initialValues: {
      no_hp: "",
      pin: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const message = `Halaman ini masih UI saja. Data login ${values.no_hp} belum dikirim ke backend.`;
        toast.info(message);
        const storedRole = typeof window !== "undefined" ? normalizeRole(localStorage.getItem("role")) : null;
        router.push(storedRole ? ROLE_HOME[storedRole] : ROUTES.USER.HOME);
      } catch (error) {
        console.error("Login Error:", error);
        toast.error("Login gagal.");
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
            <div>
              <label htmlFor="no_hp" className="text-[17px] font-medium text-[#1f1f1f] dark:text-slate-200">
                Nomor HP
              </label>
              <input
                id="no_hp"
                name="no_hp"
                type="text"
                placeholder="Masukkan nomor HP"
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
                Kata sandi
              </label>
              <div className={`mt-1 flex items-center border-0 border-b pb-2 ${touched.pin && errors.pin ? "border-[#BA6054]" : "border-[#b9b9b9] dark:border-slate-600"}`}>
                <input
                  id="pin"
                  name="pin"
                  type={showPin ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  className="w-full bg-transparent text-[24px] text-[#1f1f1f] placeholder:text-[#b7b7b7] transition-colors duration-200 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500 sm:text-[30px] md:text-[34px]"
                  value={values.pin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  aria-label="Tampilkan kata sandi"
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
                Lupa kata sandi?
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
