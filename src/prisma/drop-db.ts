import prisma from "./prisma-client";

async function main() {
    await prisma.projectSectionContent.deleteMany({});
    await prisma.gallery.deleteMany({});
    await prisma.projectSection.deleteMany({});
    await prisma.token.deleteMany({});
    await prisma.resetLink.deleteMany({})
    await prisma.user.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.typeOfProject.deleteMany({});
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.log(e)
        await prisma.$disconnect()
        process.exit(1)
    })