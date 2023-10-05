// import { useEffect, useState } from "react";

import { useAppSelector } from '@/store';

export default function ContentItem({
    section,
    index,
    onSelectSection,
}: {
    section: string;
    index: number;
    onSelectSection: () => void;
}) {
    const sectionEditing = useAppSelector(
        (state) => state.genui.sectionEditing
    );

    return (
        <div
            onClick={onSelectSection}
            className={`px-6 py-3  bg-white w-full ${
                index === sectionEditing?.index &&
                section === sectionEditing.section
                    ? 'border-indigo-400 border-2'
                    : 'border'
            }`}
        >
            <img
                src={`http://localhost:3232/assets/tailwindui/preview/${section}.png`}
            />
            {section}
        </div>
    );
}
