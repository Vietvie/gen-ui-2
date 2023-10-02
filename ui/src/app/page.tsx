'use client';
import Content from '@/components/Content';
import PageBar from '@/components/PageBar';
import Preview from '@/components/Preview';
import Sidebar from '@/components/Sidebar';
import genUiApi from '@/services/genUiApi';
import { useEffect, useState } from 'react';

export interface ILayoutGroup {
    [key: string]: string[];
}

export default function Home() {
    const [layouts, setLayouts] = useState<ILayoutGroup | undefined>();
    useEffect(() => {
        async function fetchLayouts() {
            const { data } = await genUiApi.getLayouts();
            const layouts: ILayoutGroup = {};
            data.tailwindLayouts.forEach((layout) => {
                const componentName = layout.replace(/\d+/, '');
                if (!layouts[componentName]) {
                    layouts[componentName] = [];
                }
                layouts[componentName].push(layout);
            });
            setLayouts(layouts);
        }
        fetchLayouts();
        const oldSelectedLayouts = localStorage.getItem('layouts');
        console.log(oldSelectedLayouts);
    }, []);
    return (
        <div id="wrapper" className="h-screen overflow-hidden flex">
            {layouts && <Sidebar layouts={layouts} />}
            <div className="flex-1">
                <PageBar />
                <div className="flex">
                    <Content />
                    <Preview />
                </div>
            </div>
        </div>
    );
}
