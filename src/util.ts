
export function throwError(msg: any, statusCode: number, statusText: string) {
    throw new Error(`${statusCode}:${statusText}\n${msg as string}`);
}