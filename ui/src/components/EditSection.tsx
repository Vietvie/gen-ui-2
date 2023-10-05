import genUiApi from '@/services/genUiApi';
import replicateApi from '@/services/replicateApi';
import { useAppSelector } from '@/store';
import React, { useEffect, useState } from 'react';

const EditSection = () => {
    const systemPromptTemplate =
        'You are an senior frontend developer, please help me to rewrite content in h1 and p tag But keep all attributes of these tags. \n <%HTML TEXT%>';
    const [htmlText, setHtmlText] = useState<string>(systemPromptTemplate);
    const [prompt, setPrompt] = useState('');
    const [textResponse, setTexresponse] = useState('');
    const sectionEditing = useAppSelector(
        (state) => state.genui.sectionEditing
    );

    const onSubmit = async () => {
        try {
            const { data } = await replicateApi.createPrompt({
                prompt,
                system_prompt: htmlText,
            });
            console.log(data.join(''));
            setTexresponse(data.join(''));
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (!sectionEditing) return;
        const getHtmlText = async () => {
            const regex = /<%([^%>]+)%>/g;
            try {
                const { data } = await genUiApi.readLayout({
                    page: sectionEditing.page,
                    section: sectionEditing.section,
                });
                setHtmlText((prev) =>
                    prev.replace(regex, `<%${data.textHtml}%>`)
                );
            } catch (error) {
                console.log(error);
            }
        };
        getHtmlText();
    });

    return (
        <div className={`w-[700px] shrink-0 border-l flex flex-col p-4`}>
            <div className="w-full flex flex-col gap-2  ">
                <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.currentTarget.value)}
                    type="text"
                    className="bg-slate-200 w-full p-3 border rounded-md"
                    placeholder="promt"
                />
                <textarea
                    name=""
                    id=""
                    value={htmlText}
                    cols={30}
                    rows={10}
                    className="w-full border-2 p-2 rounded-l-md"
                ></textarea>
                <div className="flex justify-end">
                    <button
                        onClick={onSubmit}
                        className="p-3 bg-indigo-500 w-20 rounded-md text-white"
                    >
                        Send
                    </button>
                </div>
            </div>
            <div>
                <textarea
                    value={textResponse}
                    onChange={(e) => setTexresponse(e.currentTarget.value)}
                    name=""
                    id=""
                    cols={30}
                    rows={10}
                    className="w-full border-2 p-2 rounded-l-md"
                ></textarea>
            </div>
        </div>
    );
};

export default EditSection;
