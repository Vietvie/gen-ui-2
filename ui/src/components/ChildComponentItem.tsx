import { useDispatch } from 'react-redux';
import { useMainContext } from './MainContext';
import { AppDispatch } from '@/store';
import { genUiAction } from '@/store/genUiSlice';

interface IChildComponentItemProps {
    name: string;
}

export default function ChildComponentItem({ name }: IChildComponentItemProps) {
    const dispatch = useDispatch<AppDispatch>();
    return (
        <div
            onClick={() => {
                // if (layouts.includes(name)) {
                //   alert(name + "already added");
                //   return;
                // }
                dispatch(genUiAction.addLayout(name));
            }}
            className="px-2 py-1 text-sm text-gray-500 cursor-pointer border rounded-md hover:bg-gray-50"
        >
            <img
                src={`http://localhost:3232/assets/tailwindui/preview/${name}.png`}
            />
            {name}
        </div>
    );
}
