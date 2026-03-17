import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Adding 6 new ecosystem projects...");

    const newProjects = [
        {
            id: "arc-bridge",
            name: "Arc Bridge",
            description: "Seamlessly transfer assets between Arc and other major networks.",
            websiteUrl: "https://bridge.testnet.arc.network",
            status: "APPROVED"
        },
        {
            id: "arc-lend",
            name: "ArcLend",
            description: "Decentralized lending and borrowing protocol for Arc native assets.",
            websiteUrl: "https://lend.testnet.arc.network",
            status: "APPROVED"
        },
        {
            id: "arc-games",
            name: "Arc Games Hub",
            description: "The premier destination for Web3 gaming built on the Arc network.",
            websiteUrl: "https://games.arc.network",
            status: "APPROVED"
        },
        {
            id: "arc-stake",
            name: "Arc Stake",
            description: "Maximize your yields with automated staking strategies.",
            websiteUrl: "https://stake.arc.network",
            status: "APPROVED"
        },
        {
            id: "arc-vault",
            name: "Arc Vault",
            description: "Secure multi-sig wallet solution for teams and DAOs on Arc.",
            websiteUrl: "https://vault.arc.network",
            status: "APPROVED"
        },
        {
            id: "arc-launchpad",
            name: "Arc Launchpad",
            description: "Launch your next project on the fastest network in the world.",
            websiteUrl: "https://launch.arc.network",
            status: "APPROVED"
        },
        {
            id: "Tower-Exchange",
            name: "Tower Exchange",
            description: "Swap tokens instantly with deep liquidity pools on Arc network.",
            websiteUrl: "https://tower.exchange",
            status: "APPROVED"
        },
    ];

    for (const p of newProjects) {
        await prisma.project.upsert({
            where: { id: p.id },
            update: { status: p.status, description: p.description },
            create: p
        });
        console.log(`Added/Updated: ${p.name}`);
    }

    console.log("Projects added successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
