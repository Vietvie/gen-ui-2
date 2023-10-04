const replace = require('replace-in-file');
const path = require('path');
const fs = require('fs-extra');
const express = require('express');
const cors = require('cors');
const catchAsync = require('./utils/catchAsync');

const resourceParentPath = path.join(__dirname, './resources');
const resourcePath = path.join(resourceParentPath, 'tailwindui');
const previewAppFolderPath = path.join(__dirname, `./demos/nextjs13/src/app`);
const pageTemplatePath = path.join(resourceParentPath, '/templates/page.js');
const app = express();
const port = 3232;

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use('/assets', express.static('resources'));

app.get(
    '/layout/:name',
    catchAsync(async (req, res, next) => {
        const name = req.params.name;
        const html = fs.readFileSync(
            path.join(resourcePath, `preview/${name}.html`)
        );
        res.json({ html: html.toString() });
    })
);

app.get(
    '/layouts',
    catchAsync(async (req, res, next) => {
        const files = fs.readdirSync(resourcePath);
        const filteredFiles = files.map((f) => f.replace('.js', ''));
        res.json({
            tailwindLayouts: filteredFiles,
        });
    })
);

app.post(
    '/generate',
    catchAsync(async (req, res, next) => {
        const body = req.body; //input {layouts: string[] page: '/page-path'}
        console.log(req.body);
        const pagePath = req.body.page;
        if (!pagePath)
            return res.status(400).json({
                msg: 'page fields  is required!',
            });
        const layouts = body.layouts;
        const destParentFolder = path.join(
            __dirname,
            `./demos/nextjs13/src/app/_components${
                pagePath === '/' ? '/_' : pagePath
            }`
        );

        const importLinks = [];
        const components = [];

        // generate file links
        layouts.forEach((section) => {
            const sourceFilePath = path.join(resourcePath, `${section}.js`);
            const destinationPath = path.join(
                destParentFolder,
                `${section}.js`
            );

            fs.copy(sourceFilePath, destinationPath);

            const importUrl = `import ${section} from '@/components${
                pagePath === '/' ? '/_' : pagePath
            }/${section}'`;

            importLinks.includes(importUrl)
                ? null
                : importLinks.push(importUrl);
            components.push(`<${section} />`);
        });

        console.log(components);
        console.log(importLinks);

        const nextJsPagePath = previewAppFolderPath + `${pagePath}/page.js`;
        await fs.copy(pageTemplatePath, nextJsPagePath);

        await replace({
            files: `./demos/nextjs13/src/app${pagePath}/page.js`,
            from: /{\/\*R_IMPORT_START(.|\r|\n)*R_IMPORT_END\*\/}/gm,
            to: `{/*R_IMPORT_START*/}
        ${importLinks.join(`
        `)}
        {/*R_IMPORT_END*/}`,
        });

        await replace({
            files: `./demos/nextjs13/src/app${pagePath}/page.js`,
            from: /{\/\*R_CONTENT_START(.|\r|\n)*R_CONTENT_END\*\/}/gm,
            to: `{/*R_CONTENT_START*/}
        ${components.join(`
        `)}
        {/*R_CONTENT_END*/}`,
        });

        res.json({
            status: 200,
        });
    })
);

app.post(
    '/delete',
    catchAsync(async (req, res, next) => {
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
    })
);

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
});
