export default function PaymentCancel() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">Payment Cancelled</h1>

      <p className="mt-4 text-muted-foreground">
        No worries. Your subscription wasn't changed.
      </p>

      <a
        href="/plans"
        className="mt-8 rounded-xl border px-6 py-3"
      >
        Back to Plans
      </a>
    </div>
  );
}