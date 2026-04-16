export function AccessDenied() {
    const params = new URLSearchParams(window.location.search);

    return (
        <div>
            {JSON.stringify({ error: 'access denied', reason: params.get('reason') || 'unknown' })}
        </div>
    );
}