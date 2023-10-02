'use client';

import { AppDispatch, useAppSelector } from '@/store';
import { genUiAction } from '@/store/genUiSlice';
import {
    ChevronLeftIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function Preview() {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const { mode } = useAppSelector((state) => state.genui);
    const dispatch = useDispatch<AppDispatch>();
    return (
        <div
            className={`w-[700px] shrink-0 border-l flex flex-col items-center ${
                mode === 'preview' ? 'fixed top-0 left-0 w-full h-full' : 'px-2'
            }`}
        >
            {mode === 'preview' && (
                <div className="w-full h-20 bg-gray-200 flex justify-between items-center p-2">
                    <ChevronLeftIcon
                        className="w-8 cursor-pointer hover:bg-indigo-500 hover:bg-opacity-60 hover:text-white p-1 rounded-full"
                        onClick={() => dispatch(genUiAction.changeMode('edit'))}
                    />
                    <div className="flex gap-4 text-gray-400 ">
                        <span>
                            <DevicePhoneMobileIcon
                                onClick={() => setIsMobile(true)}
                                className={`w-8 cursor-pointer ${
                                    isMobile && ' text-black'
                                }`}
                            />
                        </span>
                        <span>
                            <ComputerDesktopIcon
                                onClick={() => setIsMobile(false)}
                                className={`w-8 cursor-pointer ${
                                    !isMobile && ' text-black'
                                }`}
                            />
                        </span>
                    </div>
                    <Link
                        className="hover:text-indigo-600 hover:underline"
                        href={'http://localhost:3011/'}
                    >
                        Preview Page
                    </Link>
                </div>
            )}
            {isMobile && mode === 'preview' && (
                <div className="bg-white h-full w-full flex items-center justify-center">
                    <div
                        className="relative flex justify-center as h-4/5 aspect-mobile overflow-hidden  border-4 border-black rounded-2xl"
                        style={{
                            boxShadow: '10px 10px 5px 12px rgb(209, 218, 218)',
                        }}
                    >
                        <iframe
                            className="w-full h-full"
                            src="http://localhost:3011"
                        ></iframe>
                    </div>
                </div>
            )}
            {(!isMobile || mode === 'edit') && (
                <div className="bg-white h-full w-full flex items-center justify-center">
                    <iframe
                        className="w-full h-full"
                        src="http://localhost:3011"
                    ></iframe>
                </div>
            )}
        </div>
    );
}
