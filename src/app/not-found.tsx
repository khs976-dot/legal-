import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-5 text-center text-ivory">
      <p className="text-xs tracking-[0.24em] text-gold uppercase">404</p>
      <h1 className="font-display mt-4 text-4xl">الصفحة غير موجودة</h1>
      <p className="mt-2 text-lg text-gold-pale">Page not found</p>
      <Link
        href="/"
        className="mt-8 bg-gold px-5 py-3 text-sm tracking-[0.12em] text-navy-deep uppercase"
      >
        Return home
      </Link>
    </div>
  );
}
