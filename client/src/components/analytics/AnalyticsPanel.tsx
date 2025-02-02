import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { getSubscriptions } from "@/lib/api";
import { type Subscription } from "@db/schema";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { formatCurrency } from "@/lib/utils";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function AnalyticsPanel() {
  const { data: subscriptions = [] } = useQuery<Subscription[]>({
    queryKey: ["/api/subscriptions"],
  });

  const activeSubscriptions = subscriptions.filter(sub => sub.active);

  // Calculate total monthly cost
  const totalMonthlyCost = activeSubscriptions.reduce((total: number, sub: Subscription) => {
    const monthlyCost = sub.cycleType === "annually" ? Number(sub.cost) / 12 : Number(sub.cost);
    return total + monthlyCost;
  }, 0);

  // Prepare data for service type breakdown
  const serviceTypeData = activeSubscriptions.reduce((acc: Record<string, number>, sub: Subscription) => {
    const monthlyCost = sub.cycleType === "annually" ? Number(sub.cost) / 12 : Number(sub.cost);
    acc[sub.serviceType] = (acc[sub.serviceType] || 0) + monthlyCost;
    return acc;
  }, {});

  const pieData = Object.entries(serviceTypeData).map(([name, value]) => ({
    name,
    value: Number(Number(value).toFixed(2))
  }));

  // Prepare monthly cost breakdown
  const costBreakdown = activeSubscriptions.map((sub: Subscription) => ({
    name: sub.name,
    cost: Number(sub.cycleType === "annually" ? Number(sub.cost) / 12 : sub.cost)
  })).sort((a, b) => b.cost - a.cost);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Active Subscriptions</h3>
          <p className="text-3xl font-bold">{activeSubscriptions.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Monthly Spend</h3>
          <p className="text-3xl font-bold">{formatCurrency(totalMonthlyCost)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Annual Spend</h3>
          <p className="text-3xl font-bold">{formatCurrency(totalMonthlyCost * 12)}</p>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cost by Service Type</h3>
          <div className="w-full aspect-square">
            <PieChart width={400} height={400}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${formatCurrency(value)})`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Cost Breakdown</h3>
          <BarChart
            width={500}
            height={400}
            data={costBreakdown}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Bar dataKey="cost" fill="hsl(var(--primary))" />
          </BarChart>
        </Card>
      </div>
    </div>
  );
}