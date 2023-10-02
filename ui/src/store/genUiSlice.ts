import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GenUiState {
    layouts: { path: string; layouts: string[]; selected: boolean }[];
    mode: 'edit' | 'preview';
}

const initialState: GenUiState = {
    layouts: [{ path: '/', layouts: ['hello', 'haha'], selected: true }],
    mode: 'edit',
};

const genUiSlice = createSlice({
    initialState,
    reducers: {
        addLayout(state, action: PayloadAction<string>) {
            state.layouts = state.layouts.map((el) => {
                if (!el.selected) return el;
                el.layouts.push(action.payload);
                return el;
            });
        },
        removeLayout(state, action: PayloadAction<number>) {
            state.layouts = state.layouts.map((el) => {
                if (!el.selected) return el;
                return {
                    ...el,
                    layouts: el.layouts.filter(
                        (layout, index) => action.payload !== index
                    ),
                };
            });
        },
        swapLayout(
            state,
            action: PayloadAction<{ source: number; dest: number }>
        ) {
            const { source, dest } = action.payload;
            state.layouts = state.layouts.map((el) => {
                if (!el.selected) return el;
                const clonedLayout = [...el.layouts];
                const temp = clonedLayout[source];
                clonedLayout[source] = clonedLayout[dest];
                clonedLayout[dest] = temp;
                return { ...el, layouts: clonedLayout };
            });
        },
        newPath(state, action: PayloadAction<string>) {
            if (state.layouts.some((el) => el.path === action.payload)) return;
            state.layouts.map((el) => ({ ...el, selected: false }));
            state.layouts.push({
                path: action.payload,
                selected: true,
                layouts: [],
            });
        },
        removePath(state, action: PayloadAction<number>) {
            state.layouts = state.layouts.filter(
                (el, index) => index !== action.payload
            );
        },
    },
    name: 'genui',
});

const genUiReducer = genUiSlice.reducer;
const genUiAction = genUiSlice.actions;

export default genUiReducer;
export { genUiAction };
