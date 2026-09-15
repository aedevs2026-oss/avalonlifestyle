"use client";

import Image from "next/image";
import Link from "next/link";
import { Layers, Ruler, Scale } from "lucide-react";

function formatPrice(price) {
  if (price == null || price === "") return null;
  const n = Number(price);
  if (Number.isNaN(n)) return null;
  return `₹ ${n.toLocaleString("en-IN")}`;
}

export default function ChatProductCarousel({ products, onCompare }) {
  if (!products?.length) return null;

  return (
    <div className="aa-carousel" role="list">
      {products.map((p) => (
        <article key={p.id} className="aa-product-card" role="listitem">
          <div className="aa-product-card-media">
            {p.image ? (
              <Image src={p.image} alt={p.name} width={200} height={140} className="aa-product-card-img" />
            ) : (
              <div className="aa-product-card-placeholder" />
            )}
          </div>
          <div className="aa-product-card-body">
            <h4 className="aa-product-card-title">{p.name}</h4>
            {p.shortDescription ? <p className="aa-product-card-sub">{p.shortDescription}</p> : null}
            {formatPrice(p.price) ? <p className="aa-product-card-price">{formatPrice(p.price)}</p> : null}
            <ul className="aa-product-spec-icons">
              {p.height ? (
                <li title="Height">
                  <Ruler size={14} />
                  <span>{p.height}</span>
                </li>
              ) : null}
              {p.firmness ? (
                <li title="Firmness">
                  <Scale size={14} />
                  <span>{p.firmness}</span>
                </li>
              ) : null}
              {p.mattressType ? (
                <li title="Type">
                  <Layers size={14} />
                  <span>{p.mattressType}</span>
                </li>
              ) : null}
            </ul>
            <div className="aa-product-card-actions">
              {p.productUrl ? (
                <Link href={p.productUrl} className="aa-btn aa-btn-primary aa-btn-block">
                  View Product
                </Link>
              ) : null}
              <button
                type="button"
                className="aa-btn aa-btn-outline aa-btn-block"
                onClick={() => onCompare?.(p.name)}
              >
                Compare
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
