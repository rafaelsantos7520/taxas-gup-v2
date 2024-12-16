// app/api/bairros/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const  prisma = new PrismaClient();
export async function GET() {
    try {
        const bairros = await prisma.bairro.findMany({
            orderBy: {
                nome: 'asc'
            }
        });

        return NextResponse.json(bairros);
    } catch (error) {
        return NextResponse.json(
            { error: 'Erro ao buscar bairros' },
            { status: 500 }
        );
    }
}
