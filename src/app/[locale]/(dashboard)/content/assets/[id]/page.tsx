import { AssetDetail } from "@/components/content/asset-detail";

export const metadata = {
  title: "Asset Details",
  description: "View and edit content asset",
};

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  return <AssetDetail id={params.id} />;
}