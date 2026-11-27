import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../../utils/mediaUrl';

export default function PurchaseItemRow({ item }) {
  const productId = item.product_id || item.product;
  const title = item.name || item.product_name;
  const imgSrc = resolveMediaUrl(item.image);

  const thumbnail = (
    <div className="w-16 h-20 overflow-hidden bg-neutral-900 shrink-0">
      <img
        src={imgSrc}
        alt={title}
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );

  return (
    <div className="group flex items-center gap-6 border border-[#222] bg-black/40 p-4 hover:border-white/25 transition-colors">
      {productId ? (
        <Link to={`/product/${productId}`} aria-label={`View ${title}`}>
          {thumbnail}
        </Link>
      ) : (
        thumbnail
      )}

      <div className="flex-grow min-w-0">
        {productId ? (
          <Link
            to={`/product/${productId}`}
            className="inline-block text-xs md:text-sm font-light tracking-widest uppercase text-white group-hover:text-neutral-300 transition-colors underline-offset-4 hover:underline"
          >
            {title}
          </Link>
        ) : (
          <p className="text-xs md:text-sm font-light tracking-widest uppercase text-white">
            {title}
          </p>
        )}
        <p className="text-[10px] text-gray-500 uppercase mt-1.5 tracking-widest">
          Size: {item.size || 'Standard'} &nbsp;|&nbsp; Qty: {item.quantity}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-xs md:text-sm tracking-wider text-white">
          ₹{Number(item.price || 0).toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
}