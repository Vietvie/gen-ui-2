import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GenUiState {
    layouts: { page: string; layouts: string[]; selected: boolean }[];
    mode: 'edit' | 'preview';
}

const initialState: GenUiState = {
    layouts: [{ page: '/', layouts: [], selected: true }],
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

            localStorage.setItem('layouts', JSON.stringify(state));
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

            localStorage.setItem('layouts', JSON.stringify(state));
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

            localStorage.setItem('layouts', JSON.stringify(state));
        },
        newPage(state, action: PayloadAction<string>) {
            if (state.layouts.some((el) => el.page === action.payload)) return;
            state.layouts = state.layouts.map((el) => ({
                ...el,
                selected: false,
            }));
            state.layouts.push({
                page: action.payload,
                selected: true,
                layouts: [],
            });

            localStorage.setItem('layouts', JSON.stringify(state));
        },
        removePage(state, action: PayloadAction<number>) {
            const nextSelectIndex =
                state.layouts.length - 1 === action.payload
                    ? action.payload - 1
                    : action.payload;
            state.layouts = state.layouts.reduce(
                (
                    acc: {
                        page: string;
                        layouts: string[];
                        selected: boolean;
                    }[],
                    cur,
                    index
                ) => {
                    if (index === action.payload) return acc;
                    acc.push({
                        ...cur,
                        selected: index === nextSelectIndex,
                    });
                    return acc;
                },
                []
            );

            localStorage.setItem('layouts', JSON.stringify(state));
        },
        changePage(state, action: PayloadAction<number>) {
            state.layouts = state.layouts.map((el, index) => ({
                ...el,
                selected: index === action.payload,
            }));
        },
        changeMode(state, action: PayloadAction<'edit' | 'preview'>) {
            state.mode = action.payload;
        },
        setInitState(state, action: PayloadAction<GenUiState>) {
            state = action.payload;
            return state;
        },
    },
    name: 'genui',
});

const genUiReducer = genUiSlice.reducer;
const genUiAction = genUiSlice.actions;

export default genUiReducer;
export { genUiAction };
