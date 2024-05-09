import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt";
const prisma = new PrismaClient()

const sections = ['О проекте', 'Команда']
const projects = [
    {
        name: "CarrotOCR",
        logoSrc: 'http://localhost:5000/carrotOCR.svg',
        shortDesc: 'Краткое описание проекта',
        linkSsl: 'linkSSL',
        linkNoSsl: 'linkNOSSL',
    },
    {
        name: "Workbooks",
        logoSrc: 'http://localhost:5000/workbooks.svg',
        shortDesc: 'Краткое описание проекта',
        linkSsl: 'linkSSL',
        linkNoSsl: 'linkNOSSL',
    }
]
const users = [
    {
        login: 'admin',
        email: 'admin@ss.ss',
        password: 'admin'
    },
    {
        login: 'user',
        email: 'user@ss.ss',
        password: 'user'
    }
]

async function main() {
    const projectSectionsPromises = sections.map(name => prisma.projectSection.upsert({
        where: {name},
        update: {},
        create: {
            name,
        }
    }))
    const projectSections = await Promise.all(projectSectionsPromises)

    const projectsPromises = projects.map(project => prisma.project.upsert({
        where: {name: project.name},
        update: {},
        create: {
            ...project,
            projectSections: {
                connect: projectSections.map(({id}) => ({id}))
            }
        }
    }))
    const projectsContent = await Promise.all(projectsPromises)

    const usersPromises = users.map(async (user) => prisma.user.upsert({
        where: {login: user.login},
        update: {},
        create: {
            ...user,
            password: await bcrypt.hash(user.password, 2),
            projectIDs: user.login === 'admin'
                ? projectsContent.map(project => project.id)
                : []
        }
    }))
    await Promise.all(usersPromises)
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