'use client';

import { AppDispatch, useAppSelector } from '@/store';
import { genUiAction } from '@/store/genUiSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function Preview() {
    const genuiState = useAppSelector((state) => state.genui);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(genUiAction.removeLayout(1));
    }, []);
    console.log(genuiState);
    return (
        <div className="w-[700px] shrink-0 px-2 border-l">
            <iframe
                className="w-full h-screen"
                src="http://localhost:3011"
            ></iframe>
        </div>
    );
}
