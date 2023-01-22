export class ServerError extends Error {
    constructor(error: Error) {
        super(`Internal server error: ${JSON.stringify(error)}`)

        this.name = 'ServerError'
    }
}