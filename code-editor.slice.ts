import { TCodeSession } from '@/typings/code-session';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TCodeEditorState {
	currentSession: TCodeSession | null;
}

const initialState: TCodeEditorState = {
	currentSession: null
};

const codeEditorSlice = createSlice({
	name: 'codeEditorSlice',
	initialState: initialState,
	reducers: {
		setCurrentEditorSession: (state, action: PayloadAction<TCodeSession | null>) => {
			state.currentSession = action.payload;
		},
		resetCodeEditorState: (state) => state
	}
});

export const { setCurrentEditorSession, resetCodeEditorState } = codeEditorSlice.actions;
export default codeEditorSlice.reducer;
