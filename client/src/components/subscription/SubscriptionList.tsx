import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SubscriptionCard from "./SubscriptionCard";
import { getSubscriptions } from "@/lib/api";

export default function SubscriptionList() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["/api/subscriptions"],
  });

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (search && !sub.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    switch (filter) {
      case "active":
        return sub.active;
      case "inactive":
        return !sub.active;
      case "free":
        return sub.isFree;
      case "paid":
        return !sub.isFree;
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Search subscriptions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSubscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
          />
        ))}
      </div>
    </div>
  );
}
