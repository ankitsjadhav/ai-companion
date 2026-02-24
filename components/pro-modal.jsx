"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProModal } from "@/app/hooks/use-pro-modal";
import { Button } from "@/components/ui/button";
import { SelectSeparator } from "./ui/select";

import { toast } from "sonner";

export default function ProModal() {
  const proModal = useProModal();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const demoEmail = process.env.NEXT_PUBLIC_DEMO_USER_EMAIL;
  const isDemo = user?.emailAddresses?.[0]?.emailAddress === demoEmail;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubscribe = async () => {
    if (isDemo) {
      toast.info("Billing functionality is disabled in demo mode.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Something Went Wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">Upgrade to Pro</DialogTitle>
          <DialogDescription className="text-center space-y-2">
            Create
            <span className="text-sky-500 mx-1 font-medium">Custom AI</span>
            Companions!
          </DialogDescription>
        </DialogHeader>
        <SelectSeparator />
        <div className="flex justify-between">
          <p className="text-2xl font-medium">
            ₹199<span className="text-sm font-normal"> / mo</span>
          </p>
          <Button onClick={onSubscribe} disabled={loading} variant="premium">
            Subscribe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
