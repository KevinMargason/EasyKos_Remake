"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, ChevronLeft, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/core/services/api";
import { useAppSelector } from "@/core/store/hooks";
import { useKos } from "@/core/hooks/useKos";
import { unwrapApiData } from "@/core/utils/apiResponse";

type AmenityKey =
  | "wifi"
  | "cctv"
  | "kulkas"
  | "laundry"
  | "ruangTamu"
  | "dapur"
  | "lemari"
  | "meja"
  | "kursi"
  | "kasur"
  | "kamarMandiDalam"
  | "kamarMandiLuar";

interface AddRoomPageProps {
  onBack: () => void;
  onSaved?: () => void | Promise<void>;
  amenitiesIcons: Record<AmenityKey, { icon: string; label: string }>;
}

export default function AddRoomPage({
  onBack,
  onSaved,
  amenitiesIcons,
}: AddRoomPageProps) {
  const user = useAppSelector((state: any) => state.user.user);
  const { fetchKos, fetchRooms, fetchFasilitas, fetchAturan } = useKos();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("Putra");
  const [selectedRegion, setSelectedRegion] = useState("1"); // Default region ID
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    namaKos: "",
    alamat: "",
    peraturan: "",
    jumlahLantai: "",
    jumlahKamar: "",
    hargaKamar: "",
  });

  // Common regions
  const regions = [
    { id: "1", name: "Jakarta" },
    { id: "2", name: "Surabaya" },
    { id: "3", name: "Bandung" },
    { id: "4", name: "Medan" },
    { id: "5", name: "Yogyakarta" },
    { id: "6", name: "Semarang" },
    { id: "7", name: "Makassar" },
    { id: "8", name: "Palembang" },
    { id: "9", name: "Tangerang" },
    { id: "10", name: "Lainnya" },
  ];

  const [photos, setPhotos] = useState<File[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.namaKos.trim()) {
      toast.error("Nama Kos harus diisi");
      return;
    }
    if (!formData.alamat.trim()) {
      toast.error("Alamat harus diisi");
      return;
    }
    if (!formData.hargaKamar.trim()) {
      toast.error("Harga Kamar harus diisi");
      return;
    }
    if (!formData.jumlahKamar.trim()) {
      toast.error("Nomor Kamar harus diisi");
      return;
    }

    setIsLoading(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")?.replace(/['"]+/g, "")
          : null;

      const genderMap: Record<string, "Putra" | "Putri" | "Campur"> = {
        Putra: "Putra",
        Putri: "Putri",
        Campur: "Campur",
      };
      const fasilitasUmum = selectedAmenities.filter((amenity) =>
        [
          "wifi",
          "cctv",
          "kulkas",
          "laundry",
          "ruangTamu",
          "dapur",
          "kamarMandiLuar",
        ].includes(amenity),
      );
      const fasilitasKamar = selectedAmenities.filter((amenity) =>
        ["lemari", "meja", "kursi", "kasur", "kamarMandiDalam"].includes(
          amenity,
        ),
      );
      const hargaKamar = parseInt(formData.hargaKamar.replace(/\D/g, ""), 10);

      if (Number.isNaN(hargaKamar)) throw new Error("Harga Kamar tidak valid");

      const kosPayload = new FormData();
      kosPayload.append("nama", formData.namaKos);
      kosPayload.append("alamat", formData.alamat);
      kosPayload.append("gender", genderMap[selectedType] || "Campur");
      kosPayload.append("region_idregion", selectedRegion);
      kosPayload.append("jumlah_kamar", "1");
      kosPayload.append("rating", "0");

      if (formData.peraturan.trim())
        kosPayload.append("peraturan", formData.peraturan.trim());

      fasilitasUmum.forEach((fas) =>
        kosPayload.append("fasilitas_umum[]", fas),
      );

      const kosRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: kosPayload,
      });
      const kosDataRes = await kosRes.json();
      if (!kosRes.ok)
        throw new Error(kosDataRes.message || "Gagal membuat properti Kos");

      const kosId = kosDataRes.data?.id || kosDataRes.id;

      const roomPayload = new FormData();
      roomPayload.append("kos_id", kosId);
      roomPayload.append("jumlah_kamar_loop", formData.jumlahKamar.toString());
      roomPayload.append("harga", hargaKamar.toString());
      roomPayload.append("ukuran_kamar", "3x3");
      roomPayload.append("listrik", "token");
      if (user?.id) roomPayload.append("users_id", user.id);

      fasilitasKamar.forEach((fas) =>
        roomPayload.append("fasilitas_kamar[]", fas),
      );

      photos.forEach((photo) => roomPayload.append("foto[]", photo));

      const roomRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: roomPayload,
      });
      const roomDataRes = await roomRes.json();
      if (!roomRes.ok)
        throw new Error(
          roomDataRes.message ||
            "Kos berhasil dibuat, tapi gagal menyimpan Kamar/Foto",
        );

      await Promise.all([
        fetchKos(),
        fetchRooms(),
        fetchFasilitas(),
        fetchAturan(),
      ]);
      await onSaved?.();

      toast.success("Kos dan Kamar berhasil ditambahkan! 🚀");
      onBack();
    } catch (error: any) {
      console.error("❌ Submit error:", error);
      console.error("Status code:", error.response?.status);
      console.error("Error response:", error.response?.data);

      // Detailed error message for 422
      if (error.response?.status === 422) {
        const validationErrors =
          error.response?.data?.errors || error.response?.data?.message;
        const errorMsg =
          typeof validationErrors === "string"
            ? validationErrors
            : JSON.stringify(validationErrors, null, 2);

        toast.error(`Validasi gagal:\n${errorMsg}`);
        console.error("Validation details:", validationErrors);
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Gagal menambahkan kos",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ChevronLeft size={20} />
        <span>Kembali</span>
      </button>

      <form
        onSubmit={handleSubmit}
        className="rounded-[24px] bg-white p-8 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/5"
      >
        <h2 className="text-[28px] font-bold text-[#c86654]">
          Formulir Properti Baru - Kos
        </h2>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Informasi Kos
            </h3>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nama Kos
                </label>
                <input
                  type="text"
                  name="namaKos"
                  value={formData.namaKos}
                  onChange={handleInputChange}
                  placeholder="Masukkan Nama Kos Anda"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Alamat Lengkap
                </label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  placeholder="Masukkan Alamat Kos Anda"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Jenis Kos
                </label>
                <div className="mt-2 flex gap-4">
                  {["Putra", "Putri", "Campur"].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={selectedType === type}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="h-4 w-4 accent-[#c86654]"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Wilayah/Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Peraturan Kos
                </label>
                <textarea
                  name="peraturan"
                  value={formData.peraturan}
                  onChange={handleInputChange}
                  placeholder="Masukkan Peraturan Kos Anda"
                  rows={5}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Fasilitas
            </h3>

            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Jumlah Lantai
                </label>
                <input
                  type="text"
                  name="jumlahLantai"
                  value={formData.jumlahLantai}
                  onChange={handleInputChange}
                  placeholder="Masukkan Jumlah Lantai Kos Anda"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Jumlah Kamar yang Dibuat
                </label>
                <input
                  type="number"
                  name="jumlahKamar"
                  value={formData.jumlahKamar}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="Misal: 5"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Fasilitas Umum
                </label>
                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
                  {[
                    "wifi",
                    "cctv",
                    "kulkas",
                    "laundry",
                    "ruangTamu",
                    "dapur",
                    "kamarMandiLuar",
                  ].map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      type="button"
                      className={`glass-chip group relative ${selectedAmenities.includes(amenity) ? "is-active" : ""} inline-flex h-20 w-20 flex-col items-center justify-center gap-1.5 rounded-full p-0 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_6px_16px_rgba(0,0,0,0.20)]`}
                    >
                      <Image
                        src={amenitiesIcons[amenity as AmenityKey].icon}
                        alt={amenitiesIcons[amenity as AmenityKey].label}
                        width={28}
                        height={28}
                        className={`h-7 w-7 object-contain transition ${selectedAmenities.includes(amenity) ? "brightness-0 invert" : ""}`}
                      />
                      <span className="text-center text-[10px] font-semibold leading-tight">
                        {amenitiesIcons[amenity as AmenityKey].label}
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      toast.info("Fitur tambah fasilitas akan segera tersedia")
                    }
                    className="glass-chip inline-flex h-20 w-20 flex-col items-center justify-center gap-1.5 rounded-full p-0 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_6px_16px_rgba(0,0,0,0.20)]"
                    type="button"
                  >
                    <Image
                      src="/Asset/icon/icon-add.svg"
                      alt="Tambah"
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                    />
                    <span className="text-center text-[10px] font-semibold leading-tight">
                      Tambah
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Fasilitas Kamar
                </label>
                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                  {["lemari", "meja", "kursi", "kasur", "kamarMandiDalam"].map(
                    (amenity) => (
                      <button
                        key={amenity}
                        onClick={() => handleAmenityToggle(amenity)}
                        type="button"
                        className={`glass-chip group relative ${selectedAmenities.includes(amenity) ? "is-active" : ""} inline-flex h-20 w-20 flex-col items-center justify-center gap-1.5 rounded-full p-0 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_6px_16px_rgba(0,0,0,0.20)]`}
                      >
                        <Image
                          src={amenitiesIcons[amenity as AmenityKey].icon}
                          alt={amenitiesIcons[amenity as AmenityKey].label}
                          width={28}
                          height={28}
                          className={`h-7 w-7 object-contain transition ${selectedAmenities.includes(amenity) ? "brightness-0 invert" : ""}`}
                        />
                        <span className="text-center text-[10px] font-semibold leading-tight">
                          {amenitiesIcons[amenity as AmenityKey].label}
                        </span>
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      toast.info("Fitur tambah fasilitas akan segera tersedia")
                    }
                    type="button"
                    className="glass-chip inline-flex h-20 w-20 flex-col items-center justify-center gap-1.5 rounded-full p-0 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_6px_16px_rgba(0,0,0,0.20)]"
                  >
                    <Image
                      src="/Asset/icon/icon-add.svg"
                      alt="Tambah"
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                    />
                    <span className="text-center text-[10px] font-semibold leading-tight">
                      Tambah
                    </span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Harga Kamar
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-slate-700 dark:text-slate-300">Rp</span>
                  <input
                    type="text"
                    name="hargaKamar"
                    value={formData.hargaKamar}
                    onChange={handleInputChange}
                    placeholder="Masukkan Harga Kamar Kos Anda"
                    className="flexgrow w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Unggah Foto Kamar Kos
                </label>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Unggah Foto Kamar Kos
                  </label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {photos.map((photo, i) => (
                      <div
                        key={i}
                        className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
                      >
                        <img
                          src={URL.createObjectURL(photo)}
                          alt="preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setPhotos(photos.filter((_, index) => index !== i))
                          }
                          className="absolute right-0 top-0 bg-red-500/80 p-1 text-white hover:bg-red-500"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    {photos.length < 5 && (
                      <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-[#c86654] bg-white transition hover:bg-[#fef8f6] dark:border-slate-600 dark:bg-slate-800">
                        <Plus size={24} className="text-[#c86654]" />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files) {
                              const newFiles = Array.from(e.target.files);
                              setPhotos((prev) =>
                                [...prev, ...newFiles].slice(0, 5),
                              );
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Maksimal 5 foto. Format: JPG, PNG.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-lg border border-slate-300 bg-white py-3 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-lg bg-[#c86654] py-3 font-semibold text-white transition hover:bg-[#b8533d] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
