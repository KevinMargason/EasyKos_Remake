"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, ChevronLeft } from "lucide-react";
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

  // ==========================================
  // JURUS POIN 3: FUNGSI HAPUS KOS
  // ==========================================
  const handleDeleteKos = async () => {
    if (!selectedKos) {
      toast.error("Pilih Kos terlebih dahulu dari daftar di sebelah kiri");
      return;
    }

    const confirmDelete = window.confirm(
      "🚨 PERINGATAN: Apakah Anda yakin ingin menghapus Kos ini beserta seluruh kamarnya? Tindakan ini tidak dapat dibatalkan!",
    );
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")?.replace(/['"]+/g, "")
          : null;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kos/${selectedKos}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menghapus Kos");

      toast.success("Kos dan seluruh kamarnya berhasil dihapus!");

      // Refresh data setelah dihapus
      await Promise.all([fetchKos(), fetchRooms()]);
      setSelectedKos(null);
      setSelectedRoom(null);

      await onSaved?.();
      onBack(); // Otomatis kembali setelah hapus
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Gagal menghapus Kos");
    } finally {
      setIsLoading(false);
    }
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

      const kosUpdateData = {
        gender: genderMap[selectedType] || "Campur",
        fasilitas_umum: fasilitasUmum,
      };

      await api.kos.update(selectedKos, kosUpdateData);

      const roomUpdateData = {
        harga: hargaKamar,
        fasilitas_kamar: fasilitasKamar,
      };

      await api.rooms.update(selectedRoom, roomUpdateData);
      await Promise.all([fetchKos(), fetchRooms()]);
      await onSaved?.();

      toast.success("Status Kos berhasil diperbarui!");
      onBack();
    } catch (error: any) {
      console.error("Submit error:", error);
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
          Memperbarui Status Kos
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
                  placeholder="Cari Kos...."
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
                  </div>
                ) : null}
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
                  </div>
                ) : null}
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
            </div>
          </div>
        </div>

        <div className="mt-12 flex gap-3">
          {/* TOMBOL HAPUS MUNCUL KALAU KOS SUDAH DIPILIH */}
          {selectedKos && (
            <button
              type="button"
              onClick={handleDeleteKos}
              disabled={isLoading}
              className="flex-1 rounded-lg border-2 border-red-500 bg-white py-3 font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              Hapus Kos Ini
            </button>
          )}
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
