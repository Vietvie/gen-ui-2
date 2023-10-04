'use client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
} from '@hello-pangea/dnd';
import ContentItem from './ContentItem';
import { AppDispatch, useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';
import { genUiAction } from '@/store/genUiSlice';
import genUiApi from '@/services/genUiApi';
import { useState } from 'react';

export default function Content() {
    const layoutsArr = useAppSelector((state) => state.genui.layouts);
    const layoutSelected = layoutsArr.find((el) => el.selected);
    const dispatch = useDispatch<AppDispatch>();
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const onDelete = (index: number) => {
        dispatch(genUiAction.removeLayout(index));
    };

    const onGenerate = async () => {
        if (!layoutSelected) return;
        setIsGenerating(true);
        try {
            const { data } = await genUiApi.generateUi({
                layouts: layoutSelected.layouts,
                page: layoutSelected.page,
            });
        } catch (error) {
            console.log(error);
        }
        setIsGenerating(false);
    };

    const onDragEnd = (result: DropResult) => {
        console.log('onDragEnd', result);
        const destIndex = result.destination?.index;
        const sourceIndex = result.source.index;
        if (destIndex === undefined) return;

        dispatch(
            genUiAction.swapLayout({
                source: sourceIndex,
                dest: destIndex,
            })
        );
    };

    const onOpenPrevew = () => {
        dispatch(genUiAction.changeMode('preview'));
    };

    return (
        <div className="relative bg-gray-100 w-full h-screen overflow-y-auto">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="component">
                    {(provided, snapshot) => {
                        return (
                            <section
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="content w-[600px] mx-auto py-12 space-y-2"
                            >
                                {layoutSelected?.layouts.map(
                                    (layout, index) => {
                                        return (
                                            <Draggable
                                                key={layout + index}
                                                draggableId={layout + index}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="flex items-center gap-2 group"
                                                    >
                                                        <ContentItem
                                                            name={layout}
                                                        />
                                                        <span className="grow-0 w-[30px] text-gray-500 cursor-pointer">
                                                            <XMarkIcon
                                                                className="p-1 group-hover:block hidden"
                                                                onClick={() =>
                                                                    onDelete(
                                                                        index
                                                                    )
                                                                }
                                                            />
                                                        </span>
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    }
                                )}
                                {provided.placeholder}
                            </section>
                        );
                    }}
                </Droppable>
            </DragDropContext>
            <div className="fixed bottom-4 right-4 flex gap-1">
                <button
                    disabled={isGenerating}
                    onClick={onGenerate}
                    className="px-6 py-2 w-32 border rounded-md bg-indigo-500 text-white disabled:opacity-60"
                >
                    {isGenerating ? 'Generating...' : 'Generate'}
                </button>
                <button
                    onClick={onOpenPrevew}
                    className="px-6 py-2 w-32 border rounded-md bg-slate-900 text-white"
                >
                    Preview
                </button>
            </div>
        </div>
    );
}
