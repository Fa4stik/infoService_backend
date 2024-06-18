import {PrismaClient} from '@prisma/client'
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

const assets = '/api/v1/gallery'
const sections = [
    {name: 'О проекте', alt: 'Полное описание проекта'},
    {name: 'Команда', alt: 'Команда проекта'}
]
const sectionsContent = {
    team: 'Шарифулин С.В.\n Клявлин Н.А.\n Золотарев Д.В.\n Орехов Д.С.\n',
    carrotOCR: 'Проблема\n' +
        'Отсутствие в ЦСЕКА программного продукта для распознавания текста и автоматического наименования файлов по фотографиям.\n' +
        '\n' +
        'Цель\n' +
        'Реализовать MVP (минимально жизнеспособный продукт) на основе нейронных сетей для распознавания русскоязычного текста (печатного, рукописного)\n' +
        '\n' +
        'Программный продукт, позволяющий определять наименование файлов по контексту их содержания посредством нейросетевого распознавания печатного и рукописного текста',
    workBooks: 'Проблема\n' +
        'Необходимость оцифровки трудовых книжек работников ПСО (предприятий сферы обслуживания) для переноса информации в систему ALFA, при этом оцифровка осуществляется вручную из-за наличия рукописного текста, что требует значительных трудовых затрат и привлечения большого количества специалистов.\n' +
        '\n' +
        'Цель\n' +
        'Создать инструмент для оцифровки трудовых книжек работников ПСО для переноса сведений в систему ALFA с минимальными трудовыми затратами и в кратчайшие сроки, обеспечивая при этом сохранность и достоверность информации.'
}
const projects = [
    {
        name: "CarrotOCR",
        logoSrc: '/carrotOCR.svg',
        shortDesc: 'Краткое описание проекта',
        linkSsl: 'https://10.240.23.45:39782',
        linkNoSsl: 'http://10.240.23.45:39781',
    },
    {
        name: "Workbooks",
        logoSrc: '/workbooks.svg',
        shortDesc: 'Краткое описание проекта',
        linkSsl: 'https://10.240.23.45:39784',
        linkNoSsl: 'http://10.240.23.45:39783',
    },
    {
        name: "Audio",
        logoSrc: "/Audio.svg",
        shortDesc: 'Модель предназначенная для распознавания аудио',
        linkSsl: 'http://10.240.23.45:39789',
        linkNoSsl: 'http://10.240.23.45:39789',
    },
    {
        name: 'OCR',
        logoSrc: '/ocr_2.svg',
        shortDesc: 'Модель предназначенная для распознавания текста',
        linkSsl: 'http://10.240.23.45:39790',
        linkNoSsl: 'http://10.240.23.45:39790',
    }
].map(prj => ({...prj, logoSrc: assets + prj.logoSrc}))
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
    },
    {
        login: 'proton',
        email: 'stepan.sharifulin@proton.me',
        password: 'proton'
    }
]
const galleries = [
    {
        id: '1',
        projectId: '1',
        alt: 'Главный интерфейс',
        src: '/mainPageCarrot.png'
    },
    {
        id: '2',
        projectId: '1',
        alt: 'Страница создания обработки',
        src: '/CreateTaskPage.png'
    },
    {
        id: '3',
        projectId: '1',
        alt: 'Страница с готовыми обработками',
        src: '/HandlePage.png'
    },
    {
        id: '4',
        projectId: '1',
        alt: 'Страница для переименования файлов',
        src: '/RenameFileV2.png'
    },
    {
        id: '5',
        projectId: '2',
        alt: 'Страница заполнения полей для трудовой',
        src: '/MainPageWorkbooks.png'
    },
    {
        id: '6',
        projectId: '2',
        alt: 'Страница пользовательских настроек',
        src: '/SettingsWorkbooks.png'
    }
].map(img => ({...img, src: assets + img.src}))
const typeOfProjects = [
    {name: 'Проект'},
    {name: 'Контейнер'},
]

async function main() {
    const typeOfProjectsPromise = typeOfProjects.map(({name}) => prisma.typeOfProject.upsert({
        where: {name},
        update: {},
        create: {name}
    }))
    const typeOfProjectsContent = await Promise.all(typeOfProjectsPromise)

    const projectSectionsPromises = sections.map(sec => prisma.projectSection.upsert({
        where: {name: sec.name},
        update: {},
        create: {
            ...sec
        }
    }))
    const projectSections = await Promise.all(projectSectionsPromises)

    const projectsPromises = projects.map(project => prisma.project.upsert({
        where: {name: project.name},
        update: {},
        create: {
            ...project,
            typeOfProjectId: ['CarrotOCR', 'Workbooks'].includes(project.name)
                ? typeOfProjectsContent.find(t => t.name === 'Проект')?.id ?? ''
                : typeOfProjectsContent.find(t => t.name === 'Контейнер')?.id ?? '',
            projectSections: {
                connect: projectSections.map(({id}) => ({id}))
            }
        }
    }))
    const projectsContent = await Promise.all(projectsPromises)

    const projectSectionContentPromises = projectsContent.flatMap(prj =>
        projectSections.map(section =>
            prisma.projectSectionContent.upsert({
                where: {
                    projectId_projectSectionId: {
                        projectId: prj.id,
                        projectSectionId: section.id
                    }
                },
                update: {},
                create: {
                    projectId: prj.id,
                    projectSectionId: section.id,
                    content: section.name === 'О проекте'
                        ? prj.name === 'CarrotOCR' ? sectionsContent.carrotOCR : sectionsContent.workBooks
                        : sectionsContent.team
                }
        }))
    )
    await Promise.all(projectSectionContentPromises)

    const usersPromises = users.map(async (user) =>
        prisma.user.upsert({
        where: {login: user.login},
        update: {},
        create: {
            ...user,
            password: await bcrypt.hash(user.password, 2),
            role: user.login === 'admin' ? 'ADMIN' : 'USER',
            projectIDs: user.login === 'admin'
                ? projectsContent.map(project => project.id)
                : []
        }
    }))
    await Promise.all(usersPromises)

    const mapByGlrs = (glrs: typeof galleries, prjId: string) => glrs.map(({id, ...gallery}) =>
        prisma.gallery.upsert({
            where: {src: gallery.src},
            update: {},
            create: {
                ...gallery,
                projectId: prjId
            }}))
    const galleryPromises = projectsContent
        .flatMap(prj =>
            prj.name === 'CarrotOCR'
                ? mapByGlrs(galleries.filter(g => g.projectId === '1'), prj.id)
                : mapByGlrs(galleries.filter(g => g.projectId === '2'), prj.id)
        )
    await Promise.all(galleryPromises)
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