/**
 * Section heading used across the interior pages.
 *
 * `highlight` is the second half of the headline. In the reference designs it
 * is red on some sections ("Designed / for Every Lifestyle") and plain black on
 * others ("Built on Trust. / Driven by a Brighter Tomorrow."), so the tone is
 * explicit rather than always red. Pass `block` to force the highlight onto its
 * own line, matching the two-line headlines in the reference.
 */
export default function SectionHeading({
  label,
  labelIcon,
  title,
  highlight,
  highlightTone = "red",
  block = false,
  description,
  align = "left",
  className = "",
  action,
}) {
  const alignClass =
    align === "center"
      ? "text-center items-center mx-auto"
      : align === "right"
        ? "text-right items-end ml-auto"
        : "text-left items-start";

  return (
    <div className={`flex max-w-2xl flex-col gap-3 ${alignClass} ${className}`}>
      {label && (
        <span className="label-red flex items-center gap-2">
          {labelIcon}
          {label}
        </span>
      )}
      {title && (
        <h2 className="font-serif text-[1.75rem] leading-tight text-avalon-black md:text-[2rem] lg:text-[2.375rem]">
          {title}
          {highlight && (
            <>
              {block ? <br /> : " "}
              <span
                className={
                  highlightTone === "red" ? "text-avalon-red" : "text-avalon-black"
                }
              >
                {highlight}
              </span>
            </>
          )}
        </h2>
      )}
      {description && (
        <p className="text-[15px] leading-relaxed text-gray-600">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
