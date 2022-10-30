export function generateError(e: any): Error {
    if (!e.response?.status || !e.response?.statusText || !e.response?.data) return e;

    const { status, statusText, data } = e.response;
	return new Error(`${status}: ${statusText}\n${data}`);
}
