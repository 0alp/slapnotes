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
			return {...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null, user_message: "Login successful."};

		case 'REGISTRATION_SUCCESSFUL':
			localStorage.setItem("token", action.data.token);
			return {...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null, user_message: "Your registration was successful."};

		case 'BAD_REQUEST':
			return {...state, errors: action.data, user_message: null};

		case 'AUTHENTICATION_ERROR':
			return {...state, errors: action.data, isAuthenticated: false, isLoading: false, user_message: null};

		case 'LOGIN_FAILED':

		case 'RESET_SUCCESSFUL':
			// localStorage.setItem("token", action.data.token);
			localStorage.removeItem("token");
			return {...state, user: null, token: null, errors: null, isAuthenticated: false, isLoading: false, 
				user_message: "Your password has been successfully reset. Please login with your new credentials."};

		case 'REGISTRATION_FAILED':

		case 'SERVER_ERROR':
			return {...state, user_message: "Something went wrong. Please refresh this page and try again."}

		case 'LOGOUT_SUCCESSFUL':
			localStorage.removeItem("token");
			return {...state, errors: action.data, token: null, user: null,
				isAuthenticated: false, isLoading: false};

		default:
			return {...state, errors:{}};
	}
}
