"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { setToken } from "@/core/feature/token/tokenSlice";
import { setUser } from "@/core/feature/user/userSlice";
import { setRole } from "@/core/feature/role/roleSlice";
import { auth } from "@/core/services/api";

const logoPath = "/Asset/logo.png";


const loginSchema = Yup.object({
  no_hp: Yup.string()
    .matches(/^[0-9]+$/, "Hanya boleh angka")
    .min(10, "Minimal 10 digit")
    .max(15, "Maksimal 15 digit")
    .required("Nomor HP harus diisi"),
  pin: Yup.string()
    .matches(/^[0-9]+$/, "PIN harus angka")
    .length(6, "PIN harus 6 digit")
    .required("PIN harus diisi"),
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
        const payload = {
          no_hp: values.no_hp,
          pin: values.pin,
        };
        const response = await auth.login(payload);
        const access_token = response?.data?.token || response?.token;
        const userData = response?.data?.user || response?.user;
        const role = userData?.role; // 'owner', 'tenant', atau 'admin'

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6f7f6] to-[#d1f2f0]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        {/* Header Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src={logoPath}
              alt="EasyKos Logo"
              width={280}
              height={100}
              priority
              className="object-contain"
            />
          </div>
          <p className="mt-2 text-center text-base text-gray-600 font-medium">
            Selamat Datang Kembali
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Input No HP */}
            <div>
              <label
                htmlFor="no_hp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nomor HP
              </label>
              <input
                id="no_hp"
                name="no_hp"
                type="tel"
                placeholder="08123456789"
                className={`appearance-none relative block w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#17A39D] focus:border-[#17A39D] text-base 
                  ${touched.no_hp && errors.no_hp ? "border-red-500" : "border-gray-300"}`}
                value={values.no_hp}
                onChange={(e) => {
                  // Hanya izinkan angka saat mengetik
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  formik.setFieldValue("no_hp", val);
                }}
                onBlur={handleBlur}
              />
              {touched.no_hp && errors.no_hp && (
                <p className="text-red-500 text-xs mt-1">{errors.no_hp}</p>
              )}
            </div>

            {/* Input PIN */}
            <div>
              <label
                htmlFor="pin"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                PIN (6 digit)
              </label>
              <div className="relative">
                <input
                  id="pin"
                  name="pin"
                  type={showPin ? "text" : "password"}
                  placeholder="000000"
                  maxLength={6}
                  className={`appearance-none relative block w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#17A39D] focus:border-[#17A39D] text-base
                    ${touched.pin && errors.pin ? "border-red-500" : "border-gray-300"}`}
                  value={values.pin}
                  onChange={(e) => {
                    // Hanya izinkan angka dan max 6 digit
                    const val = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 6);
                    formik.setFieldValue("pin", val);
                  }}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {touched.pin && errors.pin && (
                <p className="text-red-500 text-xs mt-1">{errors.pin}</p>
              )}
            </div>
          </div>

          {/* Tombol Submit */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-[#17A39D] hover:bg-[#138780] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#17A39D] disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md"
            >
              {isSubmitting ? "Memproses..." : "Masuk"}
            </button>
          </div>

          {/* Link Daftar */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-medium text-[#17A39D] hover:text-[#138780] transition-colors"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
