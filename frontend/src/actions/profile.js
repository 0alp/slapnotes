export const fetchProfile = () => {
	return (dispatch, getState) => {
		let headers = {"Content-Type": "application/json"};
		let {token} = getState().auth;

		if (token) {
			headers["Authorization"] = `Token ${token}`;
		}

		return fetch("/api/profile/", {headers, })
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
					return dispatch({type: 'PROFILE_LOADED', profile: res.data});
				} else if (res.status === 401 || res.status === 403) {
					dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
	  				throw res.data;
				}
			})
	}
}

export const updateProfile = (colorscheme, layout, flavor) => {
	return (dispatch, getState) => {
		const token = getState().auth.token;

		let headers = {
			"Content-Type": "application/json",
		};

		if (token) {
			headers["Authorization"] = `Token ${token}`;
		}
			
		let body = JSON.stringify({colorscheme, flavor, layout});

		return fetch(`/api/profile/`, {headers, method: "PUT", body})
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
					return dispatch({type: 'UPDATE_PROFILE', profile: res.data});
				} else if (res.status === 401 || res.status === 403) {
					dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
					throw res.data;
				}
			})
	}
}
