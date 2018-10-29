const initialState = {
	token: localStorage.getItem("token"),
	isAuthenticated: null,
	isLoading: true,
	user: null,
	errors: {},
	user_message: null
};

export default function auth(state=initialState, action) {

	switch (action.type) {

		case 'USER_LOADING':
			return {...state, isLoading: true};

		case 'NOT_LOGGED_IN':
			return {...state, isLoading: false, isAuthenticated: false, errors: null};

		case 'USER_LOADED':
			return {...state, isAuthenticated: true, isLoading: false, user: action.user};

		case 'LOGIN_SUCCESSFUL':
			localStorage.setItem("token", action.data.token);
			return {...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null};

		case 'REGISTRATION_SUCCESSFUL':
			localStorage.setItem("token", action.data.token);
			return {...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null};

		case 'BAD_REQUEST':
			return {...state, errors: action.data}

		case 'AUTHENTICATION_ERROR':
		case 'LOGIN_FAILED':
	
		// if we get a 401 when not logged in
		case 'EXPIRED_TOKEN':
			return {...state, errors:{'_': 'Your password reset token has expired. Please request a new password reset link.'}}

		case 'RESET_SUCCESSFUL':
			// localStorage.setItem("token", action.data.token);
			return {...state, user: action.user, user_message: "Your password has been successfully reset."};

		case 'REGISTRATION_FAILED':

		case 'SERVER_ERROR':
			return {...state, user_message: "Something went wrong. Please refresh this page and try again."}

		case 'LOGOUT_SUCCESSFUL':
			localStorage.removeItem("token");
			return {...state, errors: action.data, token: null, user: null,
				isAuthenticated: false, isLoading: false};

		default:
			return state;
	}
}
