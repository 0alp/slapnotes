const initialState = {
	profile: null,
	isLoading: true,
};

export default function profile(state=initialState, action) {

	switch (action.type) {
		case 'PROFILE_LOADING':
			return {...state, isLoading: true};

		case 'PROFILE_LOADED':
		    return {...state, profile:action.profile[0], isLoading: false};

		case 'UPDATE_PROFILE':
		    return {...state, profile:action.profile};
				
		default:
			return state;
	}
}
