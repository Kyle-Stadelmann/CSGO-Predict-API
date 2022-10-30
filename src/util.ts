export function generateError(e: any): Error {
	const { statusCode, statusText, data } = e;

	return new Error(`${statusCode}:${statusText}\n${data}`);
}
