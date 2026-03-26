"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import UserSectionTitle from "@/component/shared/UserSectionTitle";
import { useAppSelector } from "@/core/store/hooks";
import { useKos } from "@/core/hooks/useKos";
import { ROUTES } from "@/lib/routes";

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`glass-card rounded-[18px] border border-[#e1c2b7] shadow-[0_10px_24px_rgba(15,23,42,0.05)] dark:border-slate-700/80 ${className}`}
    >
      {children}
    </div>
  );
}

function ContactOwner() {
  return (
    <Card className="flex min-h-[135px] flex-col items-center justify-center gap-3 p-5 text-center">
      <div className="relative h-[46px] w-[75px]">
        <Image
          src="/Asset/icon/icon-chat3.svg"
          alt="Simbol chat"
          fill
          className="object-contain"
        />
      </div>
      <div className="text-[17px] font-semibold text-slate-900 dark:text-slate-100">
        Hubungi Pemilik
      </div>
    </Card>
  );
}

export default function MyKosContent() {
  const user = useAppSelector((state: any) => state.user.user);
  const {
    currentKos,
    roomsList,
    fetchCurrentKos,
    fetchRooms,
    isLoading: kosLoading,
  } = useKos();

  const [payments, setPayments] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const fetchPaymentsInfo = async () => {
    if (!user?.id) return;
    setPaymentsLoading(true);
    try {
      const response = await fetch(
        "https://easykosbackend-production.up.railway.app/api/payments/info",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tenant: user?.id }),
        },
      );
      const result = await response.json();
      if (result.success) setPayments(result.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setPaymentsLoading(false);
    }
  };

  // Fungsi untuk handle klik "Bayar Sekarang"
  const handlePay = async (paymentId: number) => {
    if (isPaying) return;
    setIsPaying(true);
    try {
      const response = await fetch(
        `https://easykosbackend-production.up.railway.app/api/payments/${paymentId}/pay`,
        {
          method: "POST", // Sesuai dengan route api.php kamu
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        toast.success("Pembayaran berhasil!");
        fetchPaymentsInfo(); // Refresh data supaya status jadi PAID dan tombol hilang
      } else {
        toast.error("Gagal memproses pembayaran.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi.");
    } finally {
      setIsPaying(false);
    }
  };

  useEffect(() => {
    fetchCurrentKos();
    fetchRooms();
    fetchPaymentsInfo();
  }, [user?.id]);

  const activePayment = useMemo(() => {
    return payments && payments.length > 0 ? payments[0] : null;
  }, [payments]);

  const derivedRoom = useMemo(() => {
    if (!activePayment?.rooms_id) return null;
    return (
      roomsList.find(
        (room: any) => String(room.id) === String(activePayment.rooms_id),
      ) || null
    );
  }, [activePayment, roomsList]);

  const resolvedKos = currentKos || derivedRoom?.kos || null;

  if (kosLoading || paymentsLoading) {
    return <div className="p-10 text-center">Memuat...</div>;
  }

  const roomImages = (resolvedKos as any)?.foto?.split(",") || [
    "/Asset/kamar/kamar1.svg",
  ];
  const kosName = (resolvedKos as any)?.nama || "Kos Saya";
  const roomNumber =
    derivedRoom?.nomor_kamar || activePayment?.rooms_id || "N/A";
  const paymentAmount = parseInt(activePayment?.amount) || 0;
  const isUnpaid = activePayment?.status?.toUpperCase() === "UNPAID";
  const hasBookedKos = Boolean(resolvedKos || activePayment);

  if (!hasBookedKos) {
    return (
      <div className="mx-auto flex max-w-[1180px] flex-col gap-5">
        <UserSectionTitle title="Kos Saya" />

        <Card className="p-8 sm:p-10">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[#fff0eb] text-[#c35f46] shadow-[0_8px_20px_rgba(195,95,70,0.12)] dark:bg-[#2a1f1b] dark:text-[#f0b2a7]">
              <Search size={28} strokeWidth={2.4} />
            </div>
            <div className="space-y-2">
              <h3 className="text-[20px] font-semibold text-slate-900 dark:text-slate-100">
                Anda belum pesan kos, silahkan pesan dulu
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Setelah Anda memesan kos, informasi kamar, tagihan, dan kontak
                pemilik akan muncul di halaman ini.
              </p>
            </div>
            <Link
              href={ROUTES.USER.HOME}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#c35f46] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(195,95,70,0.22)] transition hover:bg-[#b8533d] dark:bg-[#e07b6d] dark:text-slate-950 dark:hover:bg-[#f0b2a7]"
            >
              Cari Kos Sekarang
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-5">
      <UserSectionTitle title="Kos Saya" />

      <Card className="overflow-hidden">
        <div className="grid grid-cols-3 gap-0">
          {roomImages.slice(0, 3).map((src: string, index: number) => (
            <div key={index} className="relative h-[112px] sm:h-[132px]">
              <Image src={src} alt="preview" fill className="object-cover" />
            </div>
          ))}
        </div>
        <div className="px-5 py-4">
          <h3 className="text-[18px] font-semibold">
            {kosName} - Kamar {roomNumber}
          </h3>
          <p className="text-slate-500">{(resolvedKos as any)?.alamat}</p>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <ContactOwner />

        {activePayment ? (
          <Card className="flex flex-col justify-between p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[18px] font-semibold">
                  Status:{" "}
                  <span
                    className={isUnpaid ? "text-orange-500" : "text-green-500"}
                  >
                    {isUnpaid ? "Menunggu Pembayaran" : "Lunas (PAID)"}
                  </span>
                </h3>
                <p className="text-sm text-slate-500">
                  Metode: {activePayment.jenis_pembayaran}
                </p>
              </div>
              <div className="text-[22px] font-bold text-[#c35f46]">
                Rp {paymentAmount.toLocaleString("id-ID")}
              </div>
            </div>

            {/* TOMBOL HILANG JIKA SUDAH PAID */}
            {isUnpaid && (
              <button
                onClick={() => handlePay(activePayment.id)}
                disabled={isPaying}
                className="mt-6 rounded-md bg-[#ec8a3d] py-3 font-semibold text-white shadow-lg active:scale-95 transition disabled:opacity-50"
              >
                {isPaying ? "Memproses..." : "Bayar Sekarang"}
              </button>
            )}
          </Card>
        ) : (
          <Card className="p-6 text-center text-slate-500">
            Tidak ada riwayat tagihan.
          </Card>
        )}
      </div>
    </div>
  );
}
