interface ErrorMessageProps {
  title?: string;
  message?: string;
}

export function ErrorMessage({
  title = "Something went wrong",
  message = "We could not complete this request. Please try again.",
}: ErrorMessageProps) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 p-4"
      role="alert"
    >
      <h2 className="font-semibold text-red-800">{title}</h2>

      <p className="mt-1 text-sm leading-6 text-red-700">{message}</p>
    </div>
  );
}