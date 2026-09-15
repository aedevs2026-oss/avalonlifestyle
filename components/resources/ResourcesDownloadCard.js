import Image from "next/image";
import { assets } from "@/lib/assets";

export default function ResourcesDownloadCard({ title, size, image, file_url: fileUrl }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-avalon-border bg-white">
      <div className="relative aspect-[4/3] bg-avalon-soft">
        <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
        <span
          className="absolute bottom-2.5 left-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-avalon-red shadow-sm"
          aria-hidden="true"
        >
          <Image
            src={assets.becomeDealer.document}
            alt=""
            width={14}
            height={14}
            className="brightness-0 invert"
          />
        </span>
      </div>
      <div className="flex flex-1 items-end justify-between gap-2 p-3.5 sm:p-4">
        <div className="min-w-0">
          <h3 className="text-[11px] font-semibold leading-snug text-avalon-black sm:text-xs">{title}</h3>
          <p className="mt-1 text-[10px] text-gray-500 sm:text-[0.65rem]">{size} | PDF</p>
        </div>
        {fileUrl ? (
          <a
            href={fileUrl}
            download
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-avalon-red text-white transition hover:bg-[#c9181f]"
            aria-label={`Download ${title}`}
          >
            <Image
              src={assets.resources.download}
              alt=""
              width={16}
              height={16}
              className="brightness-0 invert"
            />
          </a>
        ) : (
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-avalon-red text-white transition hover:bg-[#c9181f]"
            aria-label={`Download ${title}`}
          >
            <Image
              src={assets.resources.download}
              alt=""
              width={16}
              height={16}
              className="brightness-0 invert"
            />
          </button>
        )}
      </div>
    </article>
  );
}
