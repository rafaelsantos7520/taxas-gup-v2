import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const bairros = [
        "Adalberto Simão Nader", "Aeroporto", "Baia Nova", "Bela Vista", "Bairro Belo Horizonte", "Buenos Aires",
        "Camurugi", "Centro", "Amarelos", "Andana", "Barro Branco", "Campo Grande", "Fazenda Boa Vista", "Iguape",
        "Jaboti", "Jaboticaba", "Machinda", "Lagoa Dourada", "Palmeiras", "Reta Grande", "Rio Grande", "Samambaia",
        "Taquara de Reino", "Concha d'Ostra", "Condados", "Coroado", "Enseada Azul", "Elza Nader", "Fátima Cidade",
        "Ipiranga", "Jabaraí", "Itapebussu", "Jardim Boa Vista", "Santa Rosa", "Lagoa Funda", "Kubitschek", "Lameirão",
        "Meaípe", "Nossa Senhora da Conceição", "Muquiçaba", "Nova Guarapari", "Olaria", "Perocão", "Paturá", "Pontal da Santa Mônica",
        "Portal", "Praia do Morro", "Porto Grande", "Praia do Riacho", "Recanto da Sereia", "Santa Margarida", "Rio Calçado",
        "Santa Mônica", "São Gabriel", "São Judas Tadeu", "São José", "Setiba", "Sol Nascente", "Una", "Bairro Tartaruga",
        "Várzea Nova", "Village da Praia", "Village do Sol"
    ];

    // Inserindo os bairros no banco de dados
    for (const bairro of bairros) {
        await prisma.bairro.create({
            data: {
                nome: bairro,
            },
        });
    }

    console.log("Bairros inseridos com sucesso!");
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
