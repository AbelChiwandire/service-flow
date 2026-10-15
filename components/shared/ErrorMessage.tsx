interface ErrorMessageProps {
    title?: string;
    message?: string;
}

export function ErrorMessage({
    title = "Something went wrong",
    message = "We could not complete this request. Please try again.",
}: ErrorMessageProps) {
    return (
        <div className="alert-error" role="alert">
            <h2 className="text-maroon heading-h3">{title}</h2>

            <p className="mt-1 leading-6 error-text">{message}</p>
        </div>
    );
}
