function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
	    var cookies = document.cookie.split(';');
	    for (var i = 0; i < cookies.length; i++) {
		    var cookie = cookies[i].trim();
		    if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

export const loadUser = () => {
	return (dispatch, getState) => {
		dispatch({type: "USER_LOADING"});

		const token = getState().auth.token;
		console.log(token)

		let headers = {
			"Content-Type": "application/json",
		};

		if (token && token !== 'undefined') {
			headers["Authorization"] = `Token ${token}`;

		return fetch("/api/auth/user/", {headers, })
			.then(res => {
				if (res.status < 500) {
					return res.json().then(data => {
						return {status: res.status, data};
					})
				} else {
					console.log("Server Error!");
					throw res;
				}
			})
			.then(res => {
				if (res.status === 200) {
					dispatch({type: 'USER_LOADED', user: res.data });
					return res.data;
				} else if (res.status >= 400 && res.status < 500) {
					dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
					throw res.data;
				}
			})
		} else {
			dispatch({type:"NOT_LOGGED_IN"});
		}
	}
}

export const login = (username, password) => {
	return (dispatch, getState) => {
		let headers = {"Content-Type": "application/json"};
		let body = JSON.stringify({username, password});

		return fetch("/api/auth/login/", {headers, body, method: "POST"})
			.then(res => {
				if (res.status < 500) {
					return res.json().then(data => {
					  return {status: res.status, data};
					})
				} else {
					console.log("Server Error!");
					throw res;
				}
			})
			.then(res => {
				if (res.status === 200) {
					dispatch({type: 'LOGIN_SUCCESSFUL', data: res.data });
					return res.data;
				} else if (res.status === 403 || res.status === 401) {
					dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
					throw res.data;
				} else {
					dispatch({type: "LOGIN_FAILED", data: res.data});
					throw res.data;
				}
			})
	}
}

export const register = (username, password, email) => {
	return (dispatch, getState) => {
		let headers = {"Content-Type": "application/json"};
		let body = JSON.stringify({username, password, email});

		return fetch("/api/auth/register/", {headers, body, method: "POST"})
			.then(res => {
				if (res.status < 500) {
					return res.json().then(data => {
						return {status: res.status, data};
					})
				} else {
					console.log("Server Error!");
					throw res;
				}
			})
			.then(res => {
				if (res.status === 200) {
					dispatch({type: 'REGISTRATION_SUCCESSFUL', data: res.data });
					return res.data;
				} else if (res.status === 403 || res.status === 401) {
					dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
					throw res.data;
				} else {
					dispatch({type: "REGISTRATION_FAILED", data: res.data});
				  	throw res.data;
				}
			})
	}
}

export const logout = () => {
	return (dispatch, getState) => {
	const token = getState().auth.token;

	let headers = {
		"Content-Type": "application/json",
	};

	if (token) {
		headers["Authorization"] = `Token ${token}`;
	}

	return fetch("/api/auth/logout/", {headers, body: "", method: "POST"})
		.then(res => {
			if (res.status === 204) {
				return {status: res.status, data: {}};
			} else if (res.status < 500) {
				return res.json().then(data => {
					return {status: res.status, data};
				})
			} else {
				console.log("Server Error!");
				throw res;
			}
		})
		.then(res => {
			if (res.status === 204) {
				dispatch({type: 'LOGOUT_SUCCESSFUL'});
				return res.data;
			} else if (res.status === 403 || res.status === 401) {
				dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
				throw res.data;
			}
		})
	}
}

export const changePassword = (new_password, old_password) => {
	return (dispatch, getState) => {
		const token = getState().auth.token;

		let headers = {
			"Content-Type": "application/json",
		};

		headers["Authorization"] = `Token ${token}`;

		let body = JSON.stringify({new_password, old_password});

		return fetch("/api/auth/password/change/", {headers, body, method: "PUT"})
			.then(res => {
				if (res.status < 500) {
					return res.json().then(data => {
						return {status: res.status, data};
					})
				} else {
					console.log("Server Error!");
					throw res;
				}
			})
			.then(res => {
				if (res.status === 200) {
					dispatch({type: 'CHANGE_SUCCESSFUL', data: res.data });
					return res.data;
				} else if (res.status === 403 || res.status === 401) {
					dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
					throw res.data;
				} else {
					dispatch({type: "CHANGE_FAILED", data: res.data});
				  	throw res.data;
				}
			})
	}
}

export const resetPassword = (email) => {
	return (dispatch, getState) => {

		let csrftoken = getCookie('csrftoken');
		
		let headers = {"Content-Type": "application/json", "X-CSRFToken": csrftoken};
		let body = JSON.stringify({email});


		return fetch("/api/auth/password/reset/", {headers, body, method: "POST"})
			.then(res => {
				if (res.status < 500) {
					return res.json().then(data => {
						return {status: res.status, data};
					})
				} else {
					console.log("Server Error!");
					throw res;
				}
			})
			.then(res => {
				if (res.status === 200) {
					dispatch({type: 'RESET_SUCCESSFUL', data: res.data });
					return res.data;
				} else if (res.status === 403 || res.status === 401) {
					dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
					throw res.data;
				} else {
					dispatch({type: "RESET_FAILED", data: res.data});
				  	throw res.data;
				}
			})
	}
}


