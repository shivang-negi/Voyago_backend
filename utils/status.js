const status = {
    SUCCESS: 1,
    FAILURE: 0
}

const signup_status = {
    FAILURE: 0,
    SUCCESS: 1,
    USER_ALREADY_EXISTS : -1,
}

const login_status = {
    SUCCESS: 1,
    INVALID_PASSWORD: 0,
    USER_DOESNT_EXISTS : -1,
    FAILURE: -2
}

export {status, login_status, signup_status}; 