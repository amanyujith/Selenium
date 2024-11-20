enum logger {
    WORKER_ERROR = "Worker error:-",
    DUPLICATE_ID = "Error:- found worker with same id",
    SKIP_LISTENER = "listeners already exists. skipping new add event listener request",
    NOTFOUND ="id not found"
}
export default logger