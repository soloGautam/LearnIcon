export default function PaymentSuccess() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">🎉 Payment Successful</h1>
      <p className="mt-4 text-muted-foreground">
        Thanks for supporting LearnIcon.
        Your subscription will be activated in a few seconds.
      </p>

      <a
        href="/plans"
        className="mt-8 rounded-xl bg-primary px-6 py-3 text-primary-foreground"
      >
        Back to LearnIcon
      </a>
    </div>
  );
}