import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    const projects = [
        {
            name: "ArcSwap",
            description: "Pusat desentralisasi pertukaran token di jaringan Arc. Cepat, murah, dan aman.",
            websiteUrl: "https://arcswap.finance",
            status: "APPROVED",
        },
        {
            name: "LendArc",
            description: "Protokol peminjaman aset kripto dengan bunga rendah dan efisiensi modal tinggi.",
            websiteUrl: "https://lendarc.io",
            status: "APPROVED",
        },
        {
            name: "ArcNFT Marketplace",
            description: "Tempat terbaik untuk minting dan trading NFT eksklusif di ekosistem Arc.",
            websiteUrl: "https://arcnft.market",
            status: "APPROVED",
        },
        {
            name: "ArcGuard",
            description: "Alat keamanan pintar untuk memantau transaksi dan kontrak pintar Anda.",
            websiteUrl: "https://arcguard.tech",
            status: "APPROVED",
        },
    ];

    for (const project of projects) {
        const p = await prisma.project.upsert({
            where: { id: `demo-${project.name.toLowerCase().replace(/\s/g, "-")}` },
            update: {},
            create: {
                id: `demo-${project.name.toLowerCase().replace(/\s/g, "-")}`,
                ...project,
            },
        });
        console.log(`Created/Updated project: ${p.name}`);
    }

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
