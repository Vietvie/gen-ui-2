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

export default function Content() {
    const layoutsArr = useAppSelector((state) => state.genui.layouts);
    const layoutSelected = layoutsArr.find((el) => el.selected);
    const dispatch = useDispatch<AppDispatch>();

    const onDelete = (index: number) => {
        dispatch(genUiAction.removeLayout(index));
    };

    const onGenerate = async () => {
        if (!layoutSelected) return;
        const { data } = await genUiApi.generateUi({
            layouts: layoutSelected.layouts,
            page: layoutSelected.page,
        });
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

    const onClosePreivew = () => {
        dispatch(genUiAction.changeMode('edit'));
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
                                                        {/* <div className="px-6 py-3 border bg-white w-full">{layout}</div> */}
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
                    onClick={onGenerate}
                    className="px-6 py-2 w-32 border rounded-md bg-indigo-500 text-white"
                >
                    Generate
                </button>
                <button
                    onClick={onOpenPrevew}
                    className="px-6 py-2 w-32 border rounded-md bg-indigo-500 text-white"
                >
                    Preview
                </button>
            </div>
        </div>
    );
}
