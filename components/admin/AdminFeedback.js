export default function AdminFeedback({ error, message }) {
  if (!error && !message) return null;
  return (
    <div className="space-y-2">
      {error ? <p className="admin-alert-error">{error}</p> : null}
      {message ? <p className="admin-message-ok">{message}</p> : null}
    </div>
  );
}
