"use client";

import React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Check } from "lucide-react";

export function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Never Miss a Challenge
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Get daily questions delivered to your inbox at 9 AM
          </p>
        </div>
      </div>

      {subscribed ? (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-success/20 border border-success/30">
          <Check className="w-4 h-4 text-success" />
          <span className="text-sm text-success">
            You&apos;re subscribed! Check your inbox.
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="space-y-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-secondary border-border"
            required
          />
          <Button type="submit" className="w-full">
            Subscribe to Daily Challenges
          </Button>
        </form>
      )}
    </div>
  );
}
