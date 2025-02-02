import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { type Subscription } from "@db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubscription } from "@/lib/api";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SubscriptionCardProps {
  subscription: Subscription;
}

export default function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
    },
  });

  const monthlyCost = subscription.cycleType === "annually"
    ? Number(subscription.cost) / 12
    : Number(subscription.cost);

  return (
    <Card className={cn(
      "transition-colors",
      subscription.active ? "bg-card" : "bg-muted"
    )}>
      <CardHeader className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{subscription.name}</h3>
            <p className="text-sm text-muted-foreground">{subscription.serviceType}</p>
          </div>
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </div>
        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="text-sm">
              {subscription.isFree ? "Free" : `$${monthlyCost.toFixed(2)}/mo`}
            </p>
            <p className="text-sm text-muted-foreground">
              Renews {format(new Date(subscription.renewalDate), "PP")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(subscription.serviceUrl, "_blank");
              }}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant={subscription.active ? "destructive" : "default"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                mutation.mutate({
                  id: subscription.id,
                  active: !subscription.active,
                });
              }}
            >
              {subscription.active ? "Unsubscribe" : "Reactivate"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-4 border-t">
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-medium">Email</dt>
                  <dd>{subscription.email}</dd>
                </div>
                <div>
                  <dt className="font-medium">Start Date</dt>
                  <dd>{format(new Date(subscription.startDate), "PP")}</dd>
                </div>
                <div>
                  <dt className="font-medium">Billing Cycle</dt>
                  <dd className="capitalize">{subscription.cycleType}</dd>
                </div>
                {subscription.notes && (
                  <div>
                    <dt className="font-medium">Notes</dt>
                    <dd className="whitespace-pre-wrap">{subscription.notes}</dd>
                  </div>
                )}
                {subscription.files && subscription.files.length > 0 && (
                  <div>
                    <dt className="font-medium">Attachments</dt>
                    <dd>
                      <ul className="list-disc pl-4">
                        {subscription.files.map((file, index) => (
                          <li key={index} className="text-blue-500 hover:text-blue-700">
                            <a href={`/uploads/${file}`} target="_blank" rel="noopener noreferrer">
                              {file}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
