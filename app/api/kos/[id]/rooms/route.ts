import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const kosId = params.id;

    // For now, return mock data since backend endpoint might not exist yet
    // TODO: Replace with actual backend call when endpoint is ready
    const mockRooms = [
      { id: 1, nomor_kamar: '101', harga: 500000 },
      { id: 2, nomor_kamar: '102', harga: 500000 },
      { id: 3, nomor_kamar: '201', harga: 550000 },
      { id: 4, nomor_kamar: '202', harga: 550000 },
    ];

    // Uncomment below when backend endpoint is ready
    /*
    const backendUrl = process.env.BACKEND_URL || 'https://easykosbackend-production.up.railway.app/api';
    const response = await fetch(`${backendUrl}/kos/${kosId}/rooms`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    */

    return NextResponse.json({
      success: true,
      data: mockRooms, // Use data.data when backend is ready
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch rooms',
        data: [],
      },
      { status: 500 }
    );
  }
}