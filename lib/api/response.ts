import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function apiUnauthorized(): NextResponse<ApiResponse<never>> {
  return apiError("Unauthorized", 401);
}

export function apiNotFound(message = "Resource not found"): NextResponse<ApiResponse<never>> {
  return apiError(message, 404);
}
