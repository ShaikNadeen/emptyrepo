// appSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TAssistantData } from './assistant.slice';
import { ConversionModeTypes, IInputSection, IMessage, IOutputSection, ITestCase, ITestInfo } from './types/mutliple-tabs.slice.types';

export interface AppState {
	id: string;
	tabName: string;
	terminalActive: boolean;

	testPanelMode: 'input' | 'output';
	testCaseData: {
		input: ITestInfo;
		output: ITestInfo;
		activeTestCase: ITestCase;
		isTestCaseSectionMinimized: boolean;
		isErrorCheckSuccess: boolean;
	};
	inputSection: IInputSection;
	isFetchingErrorAndTestcase: boolean;
	loadingStates: {
		isConvertingCodeFlag: boolean;
		isGeneratingTestCases: boolean;
	};
	OutputSection: IOutputSection;

	showSuggestion: boolean;
	show: boolean;
	approvingFeedback: boolean;
	themeMode: {
		mode: string;
		[key: string]: string;
	};
	fullScreenMode: {
		mode: boolean;
		[key: string]: boolean;
	};
	
	sourceLanguage: string;
	outputLanguage: string;
	conversionMode: ConversionModeTypes;
	selectedInputCodeText: string;
	selectedTextRange: Array<number>;
	activeAssitants: {
		sourceAssitant: TAssistantData | null;
		targetAssistant: TAssistantData | null;
	};
}

export const initialState: Array<AppState> = [
	{
		id: 'Index 1',
		terminalActive: false,
		tabName: 'Index 1',

		testPanelMode: 'output',
		testCaseData: {
			input: {
				errorMessage: '',
				errorStatus: false,
				customTestCases: [],
				testCases: [],
				input_output_values: '',
				originalUnitTestCases: '',
				editedUnitedTestCases: '',
				selectedTestCase: undefined
			},
			output: {
				errorMessage: '',
				errorStatus: false,
				customTestCases: [],
				testCases: [],
				input_output_values: '',
				originalUnitTestCases: '',
				editedUnitedTestCases: '',
				selectedTestCase: undefined
			},
			activeTestCase: {
				Actual_Output: '',
				Expected_Output: '',
				Test_No: 0,
				Test_Pass: true,
				fileName: '',
				isCustomTestCase: true,
				isInputTypeFile: false,
				Test_Code: '',
				Input: [],
				output: [],
				testName: 'sample'
			},
			isTestCaseSectionMinimized: false,
			isErrorCheckSuccess: false
		},
		isFetchingErrorAndTestcase: false,
		OutputSection: {
			codeOutput: '',
			summary: '',
			showBox: false,
			copilotMode: {
				firstError: 1,
				copilotCode: '',
				currentId: '',
				showCopilot: false,
				approveMarker: true
			},
			chatInput: {
				messageInput: '',
				messages: [],
				userPrompt: ''
			}
		},
		inputSection: {
			editable: false,
			codeInput: ''
		},

		showSuggestion: false,
		show: false,
		approvingFeedback: false,
		themeMode: { mode: 'light' },
		fullScreenMode: {mode: false},
		sourceLanguage: '',
		outputLanguage: 'python',
		conversionMode: 'codeConversion',
		selectedInputCodeText: '',
		selectedTextRange: [0, 0],
		activeAssitants: {
			sourceAssitant: null,
			targetAssistant: null
		},
		loadingStates: {
			isConvertingCodeFlag: false,
			isGeneratingTestCases: false
		}
	}
];

const codeConversionSlice = createSlice({
	name: 'multipleTabs',
	initialState,
	reducers: {
		addAppState: (state, action: PayloadAction<AppState>) => {
			state.push(action.payload);
		},
		deleteAppState: (state, action: PayloadAction<string>) => {
			const idToDelete = action.payload;
			return state.filter((appState) => appState.id !== idToDelete);
		},
		updateAppStateById: (state, action: PayloadAction<{ id: string; updatedObject: Partial<AppState> }>) => {
			const { id, updatedObject } = action.payload;

			const index = state.findIndex((appState) => appState.id === id);
			if (index !== -1) {
				state[index] = { ...state[index], ...updatedObject };
			}
		},
		updateAppStateByKeys: (state, action: PayloadAction<{ index: number; updatedObject: Partial<AppState> }>) => {
			const { index, updatedObject } = action.payload;

			if (index !== -1) {
				state[index] = { ...state[index], ...updatedObject };
			}
		},

		switchUiTheme: (state, action: PayloadAction<AppState['themeMode']>) => {
			return state.map((element) => ({
				...element,
				['themeMode']: action.payload
			}));
		},

		switchFullScreenMode: (state, action: PayloadAction<{ id: string; fullScreenMode: AppState['fullScreenMode'] }>) => {
			const { id, fullScreenMode } = action.payload;
			const appState = state.find((element) => element.id === id);

			if (appState) {
				appState.fullScreenMode = fullScreenMode;
			}
		  },

		setValueByKey: (state, action: PayloadAction<{ index: number; key: keyof AppState; value: object }>) => {
			const { index, key, value } = action.payload;

			if (index !== -1) {
				state[index] = { ...state[index], [key]: value };
			}
		},
		resetAppState: () => {
			return initialState;
		},
		updateTestDataValueByMode: (state, action: PayloadAction<{ index: number; value: Partial<ITestInfo>; mode: 'input' | 'output' }>) => {
			const { index, value, mode } = action.payload;
			if (index === -1) return;
			state[index]['testCaseData'][mode] = { ...state[index]['testCaseData'][mode], ...value };
		},

		updateTestDataValueByKeys: (state, action: PayloadAction<{ index: number; value: Partial<AppState['testCaseData']> }>) => {
			const { index, value } = action.payload;
			if (index === -1) return;
			state[index]['testCaseData'] = { ...state[index]['testCaseData'], ...value };
		},

		updateChatInputValueByKey: (state, action: PayloadAction<{ index: number; value: Partial<AppState['OutputSection']['chatInput']> }>) => {
			const { index, value } = action.payload;
			if (index === -1) return;
			state[index]['OutputSection']['chatInput'] = { ...state[index]['OutputSection']['chatInput'], ...value };
		},
		appendChatInputMessage: (state, action: PayloadAction<{ index: number; value: IMessage }>) => {
			const { index, value } = action.payload;
			if (index === -1) return;
			state[index]['OutputSection']['chatInput']['messages'].push(value);
		},
		replaceLastChatInputMessage: (state, action: PayloadAction<{ index: number; value: IMessage }>) => {
			const { index, value } = action.payload;
			if (index === -1) return;
			if (state[index]['OutputSection']['chatInput']['messages'].length > 0) state[index]['OutputSection']['chatInput']['messages'].pop();
			state[index]['OutputSection']['chatInput']['messages'].push(value);
		},

		updateOutputSectionByKey: (state, action: PayloadAction<{ index: number; value: Partial<AppState['OutputSection']> }>) => {
			const { index, value } = action.payload;
			if (index === -1) return;
			state[index]['OutputSection'] = { ...state[index]['OutputSection'], ...value };
		},
		updateLoadingStatesByKey: (state, action: PayloadAction<{ index: number; value: Partial<AppState['loadingStates']> }>) => {
			const { index, value } = action.payload;
			if (index === -1) return;
			state[index]['loadingStates'] = { ...state[index]['loadingStates'], ...value };
		},
		updateActiveEgptAssistants: (state, action: PayloadAction<{ index: number; value: Partial<AppState['activeAssitants']> }>) => {
			const { index, value } = action.payload;
			if (index < 0) return;
			state[index]['activeAssitants'] = { ...state[index]['activeAssitants'], ...value };
		},
		setCustomTestCasesByMode: (state, action: PayloadAction<{ index: number; mode: AppState['testPanelMode']; value: ITestInfo['customTestCases'] }>) => {
			const { index, mode, value } = action.payload;
			if (index < 0) return;
			state[index].testCaseData[mode].customTestCases = value;
		},
		clearTestCasesDataByMode: (state, action: PayloadAction<{ index: number; mode: AppState['testPanelMode'] }>) => {
			const { index, mode } = action.payload;
			if (index < 0) return;
			state[index].testCaseData[mode] = initialState[0].testCaseData[mode];
		},
		clearTestCasesDataExceptCustomByMode: (state, action: PayloadAction<{ index: number; mode: AppState['testPanelMode'] }>) => {
			const { index, mode } = action.payload;
			if (index < 0) return;
			state[index].testCaseData[mode] = { ...initialState[0].testCaseData[mode], customTestCases: state[index].testCaseData[mode]['customTestCases'] };
		},
		clearMessagesData: (state, action: PayloadAction<{ index: number }>) => {
			const { index } = action.payload;
			if (index < 0) return;
			state[index].OutputSection = initialState[0].OutputSection;
		}
	}
});

export const {
	addAppState,
	deleteAppState,
	appendChatInputMessage,
	updateActiveEgptAssistants,
	updateAppStateById,
	switchUiTheme,
	switchFullScreenMode,
	setValueByKey,
	updateTestDataValueByMode,
	updateTestDataValueByKeys,
	updateChatInputValueByKey,
	updateOutputSectionByKey,
	resetAppState,
	replaceLastChatInputMessage,
	updateAppStateByKeys,
	updateLoadingStatesByKey,
	setCustomTestCasesByMode,
	clearTestCasesDataByMode,
	clearTestCasesDataExceptCustomByMode,
	clearMessagesData
} = codeConversionSlice.actions;
export default codeConversionSlice.reducer;
