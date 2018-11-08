const initialState = {
	errors: {},
	user_message: null,
	isSending: false
};

export default function auth(state=initialState, action) {

	switch (action.type) {

		case 'RESET_EMAIL_SENT':
			return {...state, user_message: "Email sent! Please check your email for password reset instructions.", errors:{}, isSending: false};

		case 'CONTACT_EMAIL_SENT':
			return {...state, user_message: "Thanks for contacting us! We will respond to your message as soon as possible.", errors:{}, isSending: false};

		case 'SERVER_ERROR':
			return {...state, user_message: null, errors: {server_error: "Something went wrong. Please refresh this page and try again."}, isSending: false}

		case 'EMAIL_SENDING':
			return {...state, errors: {}, user_message: null, isSending: true}

		case 'BAD_REQUEST':
			return {...state, user_message: null, errors: action.data, isSending: false}

		default:
			return state
			
	}
}
