'use client';
import Content from '@/components/Content';
import PageBar from '@/components/PageBar';
import Preview from '@/components/Preview';
import Sidebar from '@/components/Sidebar';
import genUiApi from '@/services/genUiApi';
import { AppDispatch, useAppSelector } from '@/store';
import { GenUiState, genUiAction } from '@/store/genUiSlice';
import { WalletIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export interface ILayoutGroup {
    [key: string]: string[];
}

export default function Home() {
    const [layouts, setLayouts] = useState<ILayoutGroup | undefined>();
    const dispactch = useDispatch<AppDispatch>();
    const { mode } = useAppSelector((state) => state.genui);
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
        const oldSelectedLayoutsJson = localStorage.getItem('layouts');
        if (oldSelectedLayoutsJson) {
            const oldSelectedLayouts: GenUiState = JSON.parse(
                oldSelectedLayoutsJson
            );
            dispactch(genUiAction.setInitState(oldSelectedLayouts));
        }
    }, []);
    return (
        <div id="wrapper" className="h-screen overflow-hidden flex">
            {layouts && (
                <>
                    {<Sidebar layouts={layouts} />}
                    <div className="flex-1">
                        <PageBar />
                        <div className="flex">
                            <Content />
                            <div
                                className={`w-[700px] shrink-0 border-l flex justify-center items-center text-gray-400 text-4xl font-semibold`}
                            >
                                <WalletIcon className="w-20" />
                                <p>Coming Soon</p>
                            </div>
                            {mode === 'preview' && <Preview />}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
