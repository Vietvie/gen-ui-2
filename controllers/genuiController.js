const catchAsync = require('../utils/catchAsync');
const replace = require('replace-in-file');
const path = require('path');
const fs = require('fs-extra');

const resourceParentPath = path.join(__dirname, '../resources');
const resourcePath = path.join(resourceParentPath, 'tailwindui');
const previewAppFolderPath = path.join(__dirname, `../demos/nextjs13/src/app`);
const pageTemplatePath = path.join(resourceParentPath, '/templates/page.js');

exports.getAllLayouts = catchAsync(async (req, res, next) => {
    const files = fs.readdirSync(resourcePath);
    const filteredFiles = files.map((f) => f.replace('.js', ''));
    res.json({
        tailwindLayouts: filteredFiles,
    });
});

exports.generateUi = catchAsync(async (req, res, next) => {
    //input {layouts: string[] page: '/page-path'}
    const pagePath = req.body.page;
    if (!pagePath)
        return res.status(400).json({
            msg: 'page field  is required!',
        });
    const layouts = req.body.layouts;
    const pageComponentFolder = `${previewAppFolderPath}/_components${
        pagePath === '/' ? '/_' : pagePath
    }`;

    const importLinks = [];
    const components = [];

    // generate file links
    layouts.forEach((section) => {
        const sourceFilePath = path.join(resourcePath, `${section}.js`);
        const destinationPath = path.join(pageComponentFolder, `${section}.js`);

        fs.copy(sourceFilePath, destinationPath);

        const importUrl = `import ${section} from '@/components${
            pagePath === '/' ? '/_' : pagePath
        }/${section}'`;

        importLinks.includes(importUrl) ? null : importLinks.push(importUrl);
        components.push(`<${section} />`);
    });

    console.log(components);
    console.log(importLinks);

    const newPreviewPagePath = previewAppFolderPath + `${pagePath}/page.js`;
    await fs.copy(pageTemplatePath, newPreviewPagePath);

    await replace({
        files: `${previewAppFolderPath}${pagePath}/page.js`,
        from: /{\/\*R_IMPORT_START(.|\r|\n)*R_IMPORT_END\*\/}/gm,
        to: `{/*R_IMPORT_START*/}
        ${importLinks.join(`
        `)}
        {/*R_IMPORT_END*/}`,
    });

    await replace({
        files: `${previewAppFolderPath}${pagePath}/page.js`,
        from: /{\/\*R_CONTENT_START(.|\r|\n)*R_CONTENT_END\*\/}/gm,
        to: `{/*R_CONTENT_START*/}
        ${components.join(`
        `)}
        {/*R_CONTENT_END*/}`,
    });

    console.log('gen ui OK');

    res.json({
        status: 200,
    });
});

exports.deletePage = catchAsync(async (req, res, next) => {
    //input req.body {page: '/page-path}
    const pagePath = req.body.page;
    if (!pagePath)
        return res.status(400).json({
            msg: 'page fields  is required!',
        });
    const pageComponentFolder = `${previewAppFolderPath}/_components${
        pagePath === '/' ? '/_' : pagePath
    }`;

    let pageNextJSFolder = '';
    if (pagePath === '/') {
        pageNextJSFolder = previewAppFolderPath + `/page.js`;
    } else {
        pageNextJSFolder = previewAppFolderPath + pagePath;
    }
    await fs.remove(pageNextJSFolder);
    await fs.remove(pageComponentFolder);

    res.status(200).json({
        status: 'success',
    });
});

exports.getOneLayout = catchAsync(async (req, res, next) => {
    const name = req.params.name;
    const html = fs.readFileSync(
        path.join(resourcePath, `preview/${name}.html`)
    );
    res.json({ html: html.toString() });
});

exports.readLayout = catchAsync(async (req, res, next) => {
    //input: req.body { page: '/', section: string }
    const regex = /\{\/\*START_COPY\*\/\}(.*?)\{\/\*END_COPY\*\/\}/gs;
    const { section, page } = req.body;
    const sectionPath = `${previewAppFolderPath}/_components${
        page === '/' ? '/_' : page
    }/${section}.js`;

    const textSection = fs.readFileSync(sectionPath, 'utf8');

    const match = regex.exec(textSection);
    if (!match) return res.status(400).json('not found');
    return res.status(200).json({
        textHtml: match[1],
    });
});
