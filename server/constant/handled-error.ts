export class HandledError extends Error {
    constructor(public override message: string) {
        super(message)
    }
}