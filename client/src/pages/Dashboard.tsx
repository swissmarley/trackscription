import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubscriptionList from "@/components/subscription/SubscriptionList";
import SubscriptionForm from "@/components/subscription/SubscriptionForm";
import AnalyticsPanel from "@/components/analytics/AnalyticsPanel";
import NotificationBell from "@/components/notifications/NotificationBell";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Subscription Tracker</h1>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subscription
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <SubscriptionForm onSuccess={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="subscriptions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions">
            <Card className="p-6">
              <SubscriptionList />
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-6">
              <AnalyticsPanel />
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
