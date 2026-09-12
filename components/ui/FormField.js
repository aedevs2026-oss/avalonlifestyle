export default function FormField({
  label,
  name,
  type = "text",
  required,
  placeholder,
  as = "input",
  options = [],
  rows = 4,
  className = "",
  ...props
}) {
  const id = name;
  const baseClass =
    "w-full rounded-lg border border-avalon-border bg-white px-4 py-3 text-sm text-avalon-black placeholder:text-gray-400 focus:border-avalon-red focus:outline-none transition-colors";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-avalon-black">
        {label}
        {required && <span className="text-avalon-red ml-0.5">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          placeholder={placeholder}
          className={`${baseClass} resize-y min-h-[120px]`}
          {...props}
        />
      ) : as === "select" ? (
        <select
          id={id}
          name={name}
          required={required}
          defaultValue=""
          className={`${baseClass} appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22%3E%3Cpath fill=%22%23666%22 d=%22M6 8L1 3h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1rem_center]`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={baseClass}
          {...props}
        />
      )}
    </div>
  );
}
