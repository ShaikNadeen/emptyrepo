import {Role, TUser} from '@/shared/interfaces/user';

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface TUserAuthInitialState {
	user: TUser | null;
	accessToken: string | null;
	isLoading: boolean;
	oathProviderToken: {provider: string; accessToken: string; providerAccountId: string};
	userPermissionsInfo: Role[];
}

const initialState: TUserAuthInitialState = {
	user: null,
	isLoading: true,
	accessToken: (import.meta.env['VITE_APPSEC_ACESS_TOKEN'] as string) || '',
	oathProviderToken: {provider: '', accessToken: '', providerAccountId: ''},
	userPermissionsInfo: []
};

const userSessionSlice = createSlice({
	name: 'userSessionSlice',
	initialState: initialState,
	reducers: {
		setLoading(state, action: PayloadAction<boolean>) {
			state.isLoading = action.payload;
		},
		setUser(state, action: PayloadAction<TUser | null>) {
			state.user = action.payload;
		},
		setAccessToken(state, action: PayloadAction<string | null>) {
			state.accessToken = action.payload;
		},
		setOauthProviderToken(state, action: PayloadAction<TUserAuthInitialState['oathProviderToken']>) {
			state.oathProviderToken = action.payload;
		},
		setUserPermissionsInfo(state, action: PayloadAction<TUserAuthInitialState['userPermissionsInfo']>) {
			state.userPermissionsInfo = action.payload;
		}
	}
});

export const {setLoading, setAccessToken, setUser, setOauthProviderToken,setUserPermissionsInfo} = userSessionSlice.actions;
export default userSessionSlice.reducer;
