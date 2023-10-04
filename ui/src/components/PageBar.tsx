'use client';
import genUiApi from '@/services/genUiApi';
import { AppDispatch, useAppSelector } from '@/store';
import { genUiAction } from '@/store/genUiSlice';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { FormEvent, KeyboardEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

const PageBar = () => {
    const pageList = useAppSelector((state) => state.genui.layouts);
    const [openAddPage, setOpenAddPage] = useState<boolean>(false);
    const [newPage, setNewPage] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();

    const handleChangePage = (index: number) => {
        dispatch(genUiAction.changePage(index));
    };

    const handleAddNewPage = async () => {
        const newPagePath =
            newPage === '/' ? newPage : '/' + newPage.replaceAll('/', '');
        dispatch(genUiAction.newPage(newPagePath));
        setOpenAddPage(false);
        setNewPage('');
    };

    const onBlurAddPage = (e: FormEvent<HTMLInputElement>) => {
        if (!newPage) return setOpenAddPage(false);
        handleAddNewPage();
    };

    const onEnterAddPage = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
        handleAddNewPage();
    };

    const handleRemovePage = async (index: number) => {
        try {
            await genUiApi.deleteLayout({
                page: pageList[index].page,
            });
            dispatch(genUiAction.removePage(index));
        } catch (error) {
            console.log(error);
        }
    };

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
                    className="h-full aspect-square hover:bg-slate-200"
                >
                    +
                </button>
            )}
            {openAddPage && (
                <input
                    autoFocus
                    value={newPage}
                    onChange={(e) => setNewPage(e.currentTarget.value.trim())}
                    onBlur={onBlurAddPage}
                    onKeyUp={onEnterAddPage}
                    type="text"
                    placeholder="new page"
                    className="h-full p-2 w-32"
                />
            )}
        </div>
    );
};

export default PageBar;
