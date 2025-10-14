import axios from "axios";
import { Product } from "./productService";
import { Customer } from "./customerService";
import { Reservation } from "./bookingService";

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 10000,
});

export interface PublicMenuRequest {
  orgId: string;
  projId: string;
}

export interface CreatePublicReservationRequest {
  orgId: string;
  projId: string;
  customer: {
    name: string;
    email?: string;
    phone: string;
  };
  reservation: {
    datetime: string;
    party_size: number;
    note?: string;
    source?: "internal" | "public";
  };
}

export interface AvailableTimesRequest {
  orgId: string;
  projId: string;
  date: string; // YYYY-MM-DD
  party_size: number;
}

export interface AvailableTime {
  time: string; // HH:mm
  available: boolean;
}

export const publicService = {
  // Buscar produtos do cardápio sem autenticação
  getMenuProducts: (orgId: string, projId: string) =>
    publicApi.get<Product[]>(`/public/menu/${orgId}/${projId}`),

  // Buscar horários disponíveis para reserva
  getAvailableTimes: (params: AvailableTimesRequest) =>
    publicApi.get<AvailableTime[]>(
      `/public/times/${params.orgId}/${params.projId}?date=${params.date}&party_size=${params.party_size}`
    ),

  // Criar reserva pública (cria cliente + reserva automaticamente)
  createPublicReservation: (data: CreatePublicReservationRequest) =>
    publicApi.post<{ customer: Customer; reservation: Reservation }>(
      `/public/reservation/${data.orgId}/${data.projId}`,
      {
        customer: data.customer,
        reservation: data.reservation,
      }
    ),

  // Buscar informações básicas do projeto/restaurante
  getProjectInfo: (orgId: string, projId: string) =>
    publicApi.get<{
      name: string;
      description?: string;
      image_url?: string;
      contact_info?: {
        phone?: string;
        email?: string;
        address?: string;
      };
    }>(`/public/project/${orgId}/${projId}`),
};