import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/core/store/hooks";
import * as apiService from "@/core/services/api";
import { unwrapApiData, unwrapApiList } from "@/core/utils/apiResponse";
import {
  setKosList,
  setCurrentKos,
  setRoomsList,
  setCurrentRoom,
  setFasilitas,
  setAturan,
  setLoading,
  setError,
} from "@/core/feature/kos/kosSlice";

export const useKos = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.kos);

  const fetchKos = useCallback(
    async (ownerId) => {
      // HANYA ADA INI, JANGAN ADA TULISAN setIsLoading SAMA SEKALI!
      dispatch(setLoading(true));

      try {
        // 🔥 HARCODE URL SEMENTARA BIAR GAK UNDEFINED!
        const API_BASE = "https://easykosbackend-production.up.railway.app/api";
        //const API_BASE = "http://127.0.0.1:8000/api";

        // Logika URL: Kalau dipanggil dari dashboard owner, kasih filter. Kalau dari halaman user biasa, ambil semua.
        const url = ownerId
          ? `${API_BASE}/kos?owner_id=${ownerId}`
          : `${API_BASE}/kos`;

        // Debugging: Biar kamu bisa lihat di browser console kalau URL-nya udah bener
        console.log("Nembak API ke:", url);

        const response = await fetch(url);
        const result = await response.json();

        if (
          result.success ||
          Array.isArray(result.data) ||
          Array.isArray(result)
        ) {
          // Bypass Redux Unwrap
          const finalData = result.data || result;
          dispatch(setKosList(finalData));
        }
      } catch (error) {
        console.error("Error fetching kos:", error);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const fetchKosDetail = useCallback(
    async (id) => {
      try {
        dispatch(setLoading(true));
        const response = await apiService.kos.getDetail(id);
        dispatch(setCurrentKos(unwrapApiData(response)));
      } catch (error) {
        dispatch(setError(error?.message || "Gagal mengambil detail kos"));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const fetchRooms = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.rooms.getAll();
      dispatch(setRoomsList(unwrapApiList(response)));
    } catch (error) {
      dispatch(setError(error?.message || "Gagal mengambil daftar kamar"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchRoomDetail = useCallback(
    async (id) => {
      try {
        dispatch(setLoading(true));
        const response = await apiService.rooms.getDetail(id);
        dispatch(setCurrentRoom(unwrapApiData(response)));
      } catch (error) {
        dispatch(setError(error?.message || "Gagal mengambil detail kamar"));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const fetchFasilitas = useCallback(async () => {
    try {
      const response = await apiService.fasilitas.getAll();
      dispatch(setFasilitas(unwrapApiList(response)));
    } catch (error) {
      dispatch(setError(error?.message || "Gagal mengambil fasilitas"));
    }
  }, [dispatch]);

  const fetchAturan = useCallback(async () => {
    try {
      const response = await apiService.aturan.getAll();
      dispatch(setAturan(unwrapApiList(response)));
    } catch (error) {
      dispatch(setError(error?.message || "Gagal mengambil aturan"));
    }
  }, [dispatch]);

  const fetchCurrentKos = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.kos.getCurrent();
      dispatch(setCurrentKos(unwrapApiData(response)));
    } catch (error) {
      if (error?.response?.status === 404) {
        dispatch(setCurrentKos(null));
        return;
      }
      dispatch(setError(error?.message || "Gagal mengambil data kos saat ini"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    ...state,
    fetchKos,
    fetchKosDetail,
    fetchRooms,
    fetchRoomDetail,
    fetchFasilitas,
    fetchAturan,
    fetchCurrentKos,
  };
};
