export function generateError(e: any): Error {
    const { status, statusText, data } = e.response;
	return new Error(`${status}:${statusText}\n${data}`);
}
