import { Link } from "react-router";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
};

export default function EmptyState({
  title,
  description,
  actionLabel = "Browse products",
  actionTo = "/all-products",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <p className="text-lg font-medium text-gray-700">{title}</p>
      <p className="text-sm text-gray-500 mt-2 max-w-md">{description}</p>
      {actionTo && (
        <Link
          to={actionTo}
          className="mt-6 px-6 py-2.5 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
