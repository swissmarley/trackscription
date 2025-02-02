import { type Subscription, type Notification } from "@db/schema";

export async function getSubscriptions(): Promise<Subscription[]> {
  const res = await fetch("/api/subscriptions");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createSubscription(data: any): Promise<Subscription> {
  const res = await fetch("/api/subscriptions", {
    method: "POST",
    body: data instanceof FormData ? data : JSON.stringify(data),
    headers: data instanceof FormData ? {} : {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateSubscription(data: Partial<Subscription> & { id: number }): Promise<Subscription> {
  const res = await fetch(`/api/subscriptions/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getNotifications(): Promise<Notification[]> {
  const res = await fetch("/api/notifications");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function markNotificationAsRead(id: number): Promise<Notification> {
  const res = await fetch(`/api/notifications/${id}/read`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}