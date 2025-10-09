"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubscribe = async () => {
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
