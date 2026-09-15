"use client";

import Image from "next/image";
import Link from "next/link";

export default function ChatComparisonGrid({ comparison, products }) {
  if (!comparison?.headers?.length) return null;

  return (
    <div className="aa-compare-scroll">
    <div className="aa-compare-wrap">
      <div className="aa-compare-head">
        {comparison.headers.map((name, i) => {
          const prod = products?.[i];
          return (
            <div key={name} className="aa-compare-col-head">
              {prod?.image ? (
                <Image src={prod.image} alt="" width={72} height={56} className="aa-compare-thumb" />
              ) : null}
              <span>{name}</span>
            </div>
          );
        })}
      </div>
      <table className="aa-compare-table">
        <tbody>
          {comparison.rows.map((row) => (
            <tr key={row.field}>
              <th scope="row">{row.field}</th>
              {row.values.map((val, i) => (
                <td key={i}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="aa-compare-foot">
        {comparison.headers.map((name, i) => {
          const url = products?.[i]?.productUrl;
          return url ? (
            <Link key={name} href={url} className="aa-btn aa-btn-primary aa-btn-sm">
              View {name}
            </Link>
          ) : null;
        })}
      </div>
    </div>
    </div>
  );
}
