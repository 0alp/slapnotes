const initialState = {
	errors: {},
	user_message: null
};

export default function auth(state=initialState, action) {

	switch (action.type) {

		case 'RESET_EMAIL_SENT':
			return {...state, user_message: "Email sent! Please check your email for password reset instructions.", errors:{}};

		case 'CONTACT_EMAIL_SENT':
			return {...state, user_message: "Thanks for contacting us! We will respond to your message as soon as possible.", errors:{}};

		case 'SERVER_ERROR':
			return {...state, errors: {server_error: "Something went wrong. Please refresh this page and try again."}}

		case 'BAD_REQUEST':
			return {...state, errors: action.data}

		default:
			return {...state, user_message: null};
	}
}
