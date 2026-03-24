"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, ChevronLeft, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/core/services/api";
import { useKos } from "@/core/hooks/useKos";

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

interface UpdateStatusPageProps {
  onBack: () => void;
  onSaved?: () => void | Promise<void>;
  kosList: Array<{ label: string; value: string }>;
  roomsList: Array<{ label: string; value: string; kosId: string }>;
  amenitiesIcons?: Record<AmenityKey, { icon: string; label: string }>;
}

export default function UpdateStatusPage({
  onBack,
  onSaved,
  kosList,
  roomsList,
  amenitiesIcons,
}: UpdateStatusPageProps) {
  const { fetchKos, fetchRooms } = useKos();
  const [selectedKos, setSelectedKos] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedFasilitasUmum, setSelectedFasilitasUmum] = useState<string[]>(
    [],
  );
  const [selectedFasilitasKamar, setSelectedFasilitasKamar] = useState<
    string[]
  >([]);
  const [selectedType, setSelectedType] = useState("Putra");
  const [isLoading, setIsLoading] = useState(false);

  const [photos, setPhotos] = useState<File[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    hargaKamar: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedKos) {
      toast.error("Pilih Kos terlebih dahulu");
      return;
    }

    if (!selectedRoom) {
      toast.error("Pilih kamar terlebih dahulu");
      return;
    }

    if (!formData.hargaKamar.trim()) {
      toast.error("Harga Kamar harus diisi");
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
      const fasilitasUmum = selectedFasilitasUmum.filter((a) =>
        [
          "wifi",
          "cctv",
          "kulkas",
          "laundry",
          "ruangTamu",
          "dapur",
          "kamarMandiLuar",
        ].includes(a),
      );
      const fasilitasKamar = selectedFasilitasKamar.filter((a) =>
        ["lemari", "meja", "kursi", "kasur", "kamarMandiDalam"].includes(a),
      );
      const hargaKamar = parseInt(formData.hargaKamar.replace(/\D/g, ""), 10);

      if (Number.isNaN(hargaKamar)) throw new Error("Harga Kamar tidak valid");

      const kosId = selectedKos;
      const roomId = selectedRoom;

      // --- 1. UPDATE KOS ---
      const kosPayload = new FormData();
      kosPayload.append("_method", "PUT"); // Jurus Manipulasi Laravel
      kosPayload.append("gender", genderMap[selectedType] || "Campur");
      fasilitasUmum.forEach((fas) =>
        kosPayload.append("fasilitas_umum[]", fas),
      );

      const kosRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kos/${kosId}`,
        {
          method: "POST", // WAJIB POST (karena diakalin _method='PUT' di atas)
          headers: { Authorization: `Bearer ${token}` },
          body: kosPayload,
        },
      );
      if (!kosRes.ok) throw new Error("Gagal update data Kos");

      // --- 2. UPDATE KAMAR & FOTO ---
      const roomPayload = new FormData();
      roomPayload.append("_method", "PUT"); // Jurus Manipulasi Laravel
      roomPayload.append("harga", hargaKamar.toString());
      fasilitasKamar.forEach((fas) =>
        roomPayload.append("fasilitas_kamar[]", fas),
      );
      photos.forEach((photo) => roomPayload.append("foto[]", photo));

      const roomRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}`,
        {
          method: "POST", // WAJIB POST
          headers: { Authorization: `Bearer ${token}` },
          body: roomPayload,
        },
      );
      if (!roomRes.ok) throw new Error("Gagal update data Kamar & Foto");

      await Promise.all([fetchKos(), fetchRooms()]);
      await onSaved?.();

      toast.success("Status Kos & Kamar berhasil diperbarui! 🚀");
      onBack();
    } catch (error: any) {
      console.error("Submit error:", error);
      console.error("Status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Gagal memperbarui Status Kos",
      );
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
          Update Status Kos
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_2fr] lg:grid-cols-3">
          <div>
            <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
              Daftar Kamar Kos
            </h3>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari Kamar...."
                  readOnly
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                />
                <Image
                  src="/Asset/icon/icon-search-home.svg"
                  alt="search"
                  width={20}
                  height={20}
                  className="absolute right-3 top-3.5"
                />
              </div>
              {kosList.map((kos) => (
                <button
                  key={kos.value}
                  type="button"
                  onClick={() => {
                    setSelectedKos(kos.value);
                    setSelectedRoom(null);
                  }}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition ${
                    selectedKos === kos.value
                      ? "border-[#c86654] bg-[#fef8f6] text-[#c86654] dark:bg-slate-800"
                      : "border-slate-200 bg-white text-slate-900 hover:border-[#c86654] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  }`}
                >
                  {kos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Detail Kamar */}
          <div className="lg:col-span-2">
            {selectedKos ? (
              <div className="mb-6">
                <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
                  Pilih Kamar
                </h3>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {roomsList
                    .filter((room) => room.kosId === selectedKos)
                    .map((room) => (
                      <button
                        key={room.value}
                        type="button"
                        onClick={() => setSelectedRoom(room.value)}
                        className={`rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition ${
                          selectedRoom === room.value
                            ? "border-[#c86654] bg-[#fef8f6] text-[#c86654] dark:bg-slate-800"
                            : "border-slate-200 bg-white text-slate-900 hover:border-[#c86654] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {room.label}
                      </button>
                    ))}
                </div>
              </div>
            ) : null}

            <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
              Jenis Kos
            </h3>
            <div className="mb-6 flex gap-3">
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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Fasilitas Umum
                </label>
                {amenitiesIcons ? (
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
                        type="button"
                        onClick={() =>
                          setSelectedFasilitasUmum((prev) =>
                            prev.includes(amenity)
                              ? prev.filter((a) => a !== amenity)
                              : [...prev, amenity],
                          )
                        }
                        className={`glass-chip group relative ${selectedFasilitasUmum.includes(amenity) ? "is-active" : ""} inline-flex h-20 w-20 flex-col items-center justify-center gap-1.5 rounded-full p-0 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_6px_16px_rgba(0,0,0,0.20)]`}
                      >
                        <Image
                          src={amenitiesIcons[amenity as AmenityKey].icon}
                          alt={amenitiesIcons[amenity as AmenityKey].label}
                          width={28}
                          height={28}
                          className={`h-7 w-7 object-contain transition ${selectedFasilitasUmum.includes(amenity) ? "brightness-0 invert" : ""}`}
                        />
                        <span className="text-center text-[10px] font-semibold leading-tight">
                          {amenitiesIcons[amenity as AmenityKey].label}
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {}}
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
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "Wifi",
                      "CCTV",
                      "Kulkas",
                      "Laundry",
                      "Ruang Tamu",
                      "Dapur",
                    ].map((facility) => (
                      <label
                        key={facility}
                        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 transition dark:border-slate-700 dark:bg-slate-800"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-[#c86654]"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {facility}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Fasilitas Kamar
                </label>
                {amenitiesIcons ? (
                  <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                    {[
                      "lemari",
                      "meja",
                      "kursi",
                      "kasur",
                      "kamarMandiDalam",
                    ].map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() =>
                          setSelectedFasilitasKamar((prev) =>
                            prev.includes(amenity)
                              ? prev.filter((a) => a !== amenity)
                              : [...prev, amenity],
                          )
                        }
                        className={`glass-chip group relative ${selectedFasilitasKamar.includes(amenity) ? "is-active" : ""} inline-flex h-20 w-20 flex-col items-center justify-center gap-1.5 rounded-full p-0 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_6px_16px_rgba(0,0,0,0.20)]`}
                      >
                        <Image
                          src={amenitiesIcons[amenity as AmenityKey].icon}
                          alt={amenitiesIcons[amenity as AmenityKey].label}
                          width={28}
                          height={28}
                          className={`h-7 w-7 object-contain transition ${selectedFasilitasKamar.includes(amenity) ? "brightness-0 invert" : ""}`}
                        />
                        <span className="text-center text-[10px] font-semibold leading-tight">
                          {amenitiesIcons[amenity as AmenityKey].label}
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {}}
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
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "Lemari",
                      "Meja",
                      "Kursi",
                      "Kasur",
                      "Kamar Mandi Dalam",
                      "Tambah",
                    ].map((facility) => (
                      <label
                        key={facility}
                        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 transition dark:border-slate-700 dark:bg-slate-800"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-[#c86654]"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {facility}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
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
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                  />
                </div>
              </div>

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
