import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16 py-6 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <span>&copy; {new Date().getFullYear()} Linkist</span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
