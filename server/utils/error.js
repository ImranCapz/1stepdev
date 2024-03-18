export const errorHandler = (stateCode, message) => {
    const error = new Error(message);
    error.stateCode = stateCode;
    error.message = message;
    return error;
};