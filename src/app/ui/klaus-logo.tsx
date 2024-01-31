import { BugAntIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function KlausLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <BugAntIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]">Klaus</p>
    </div>
  );
}