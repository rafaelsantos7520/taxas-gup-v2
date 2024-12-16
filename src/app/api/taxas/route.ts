// app/api/taxas/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const origemId = searchParams.get('origemId');
    const destinoId = searchParams.get('destinoId');

    try {
        if (origemId && destinoId) {
            const taxa = await prisma.taxa.findFirst({
                where: {
                    bairroOrigemId: Number(origemId),
                    bairroDestinoId: Number(destinoId),
                },
                include: {
                    bairroOrigem: { select: { nome: true } },
                    bairroDestino: { select: { nome: true } },
                },
            });
            return NextResponse.json(taxa);
        } else {
            const taxas = await prisma.taxa.findMany({
                include: {
                    bairroOrigem: { select: { nome: true } },
                    bairroDestino: { select: { nome: true } },
                },
                orderBy: [
                    { bairroOrigem: { nome: 'asc' } },
                    { bairroDestino: { nome: 'asc' } },
                ],
            });
            return NextResponse.json(taxas);
        }
    } catch (error) {
        console.error('Erro ao buscar taxa(s):', error);
        return NextResponse.json(
            { error: 'Erro ao buscar taxa(s)' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { bairroOrigemId, bairroDestinoId, valor } = body;

        // Verifica se já existe uma taxa com a mesma origem e destino
        const taxaExistente = await prisma.taxa.findFirst({
            where: {
                AND: [
                    { bairroOrigemId: bairroOrigemId },
                    { bairroDestinoId: bairroDestinoId }
                ]
            },
            include: {
                bairroOrigem: { select: { nome: true } },
                bairroDestino: { select: { nome: true } },
            },
        });

        if (taxaExistente) {
            // Se existir, você pode escolher entre:
            // Opção 1: Atualizar a taxa existente
            const taxaAtualizada = await prisma.taxa.update({
                where: { id: taxaExistente.id },
                data: { valor },
                include: {
                    bairroOrigem: { select: { nome: true } },
                    bairroDestino: { select: { nome: true } },
                },
            });

            return NextResponse.json({
                message: 'Taxa existente atualizada',
                data: taxaAtualizada,
                updated: true
            }, { status: 200 });
        }

        const novaTaxa = await prisma.taxa.create({
            data: {
                bairroOrigemId,
                bairroDestinoId,
                valor,
            },
            include: {
                bairroOrigem: { select: { nome: true } },
                bairroDestino: { select: { nome: true } },
            },
        });

        return NextResponse.json({
            message: 'Nova taxa criada',
            data: novaTaxa,
            created: true
        });

    } catch (error) {
        console.error('Erro ao criar/atualizar taxa:', error);
        return NextResponse.json(
            { error: 'Erro ao criar/atualizar taxa' },
            { status: 500 }
        );
    }
}
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, bairroOrigemId, bairroDestinoId, valor } = body;

        const taxaAtualizada = await prisma.taxa.update({
            where: { id },
            data: {
                bairroOrigemId,
                bairroDestinoId,
                valor
            },
            include: {
                bairroOrigem: { select: { nome: true } },
                bairroDestino: { select: { nome: true } },
            },
        });

        return NextResponse.json(taxaAtualizada);
    } catch (error) {
        console.error('Erro ao atualizar taxa:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar taxa' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = Number(searchParams.get('id'));

        await prisma.taxa.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao deletar taxa:', error);
        return NextResponse.json(
            { error: 'Erro ao deletar taxa' },
            { status: 500 }
        );
    }
}
