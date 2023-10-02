'use client';
import { AppDispatch, useAppSelector } from '@/store';
import { genUiAction } from '@/store/genUiSlice';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

const PageBar = () => {
    const pageList = useAppSelector((state) => state.genui.layouts);
    const [openAddPage, setOpenAddPage] = useState<boolean>(false);
    const [newPage, setNewPage] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();

    const handleChangePage = (index: number) => {
        dispatch(genUiAction.changePage(index));
    };

    const handleAddNewPage = (e: FormEvent<HTMLInputElement>) => {
        if (!newPage) {
            return setOpenAddPage(false);
        }
        dispatch(genUiAction.newPage('/' + newPage.trim()));
        setOpenAddPage(false);
        setNewPage('');
    };

    const handleRemovePage = (index: number) => {
        dispatch(genUiAction.removePage(index));
    };

    console.log(pageList);

    return (
        <div className="flex shadow-sm border-b h-14 items-center">
            {pageList.map((el, index) => (
                <div
                    key={el.page}
                    onClick={() => handleChangePage(index)}
                    className={`p-3 relative h-full group flex justify-between cursor-pointer border-r items-center w-32  ${
                        el.selected &&
                        'border-b-[2px] border-b-indigo-600 text-indigo-600 bg-slate-100'
                    }`}
                >
                    <button
                        className="text-ellipsis overflow-hidden whitespace-nowrap"
                        key={el.page}
                    >
                        {el.page}
                    </button>
                    <XMarkIcon
                        onClick={() => handleRemovePage(index)}
                        className="w-5 min-w-[20px] aspect-square hidden group-hover:block hover:bg-indigo-500 hover:bg-opacity-50 hover:text-white rounded-full"
                    />
                </div>
            ))}
            {!openAddPage && (
                <button
                    onClick={() => setOpenAddPage(true)}
                    className="h-full aspect-square"
                >
                    +
                </button>
            )}
            {openAddPage && (
                <input
                    autoFocus
                    value={newPage}
                    onChange={(e) => setNewPage(e.currentTarget.value.trim())}
                    onBlur={handleAddNewPage}
                    type="text"
                    placeholder="new page"
                    className="h-full p-2"
                />
            )}
        </div>
    );
};

export default PageBar;
