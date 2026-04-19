"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { 
  DollarSignIcon, 
  EditIcon, 
  PlusIcon, 
  ShieldIcon, 
  ZapIcon,
  CircleIcon
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SubscriptionPlan } from "@/lib/enum";
import {
  createPricingPlan,
  getAllPricingPlans,
  IPricingPlan,
  IPricingCreatePayload,
  IPricingUpdatePayload,
  updatePricingPlan,
} from "@/services/Admin/pricing.service";

const PricingManagement = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<IPricingPlan | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    plan: "MONTHLY",
    price: "",
    features: "",
    isActive: true,
    isPopular: false,
    stripePriceId: "",
  });

  const { data: pricingPlansData, isLoading } = useQuery<IPricingPlan[]>({
    queryKey: ["admin-pricing-plans"],
    queryFn: () => getAllPricingPlans() as Promise<IPricingPlan[]>,
  });

  const createMutation = useMutation({
    mutationFn: (data: IPricingCreatePayload) => createPricingPlan(data),
    onSuccess: (res: { success: boolean; message: string }) => {
      if (res.success) {
        toast.success(res.message);
        setIsCreateOpen(false);
        queryClient.invalidateQueries({ queryKey: ["admin-pricing-plans"] });
      } else {
        toast.error(res.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IPricingUpdatePayload }) =>
      updatePricingPlan(id, data),
    onSuccess: (res: { success: boolean; message: string }) => {
      if (res.success) {
        toast.success(res.message);
        setIsEditOpen(false);
        queryClient.invalidateQueries({ queryKey: ["admin-pricing-plans"] });
      } else {
        toast.error(res.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const plans = pricingPlansData || [];

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      plan: "MONTHLY",
      price: "",
      features: "",
      isActive: true,
      isPopular: false,
      stripePriceId: "",
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (plan: IPricingPlan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      plan: plan.plan,
      price: plan.price.toString(),
      features: plan.features.join("\\n"),
      isActive: plan.isActive,
      isPopular: plan.isPopular,
      stripePriceId: plan.stripePriceId || "",
    });
    setIsEditOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name: formData.name,
      plan: formData.plan as keyof typeof SubscriptionPlan,
      price: Number(formData.price),
      features: formData.features.split("\\n").filter((f) => f.trim() !== ""),
      isActive: formData.isActive,
      isPopular: formData.isPopular,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    updateMutation.mutate({
      id: selectedPlan.id,
      data: {
        name: formData.name,
        price: Number(formData.price),
        features: formData.features.split("\\n").filter((f) => f.trim() !== ""),
        isActive: formData.isActive,
        isPopular: formData.isPopular,
        stripePriceId: formData.stripePriceId || null,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-600/10">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
          <DollarSignIcon className="h-8 w-8 animate-pulse text-red-600" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen space-y-8 p-6 text-white lg:p-10">
        {/* Cinematic Header */}
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-8 backdrop-blur-2xl"
        >
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                Pricing Intelligence
              </h1>
              <p className="text-neutral-500 font-medium mt-2">Manage and synchronize subscription pricing architectures.</p>
            </div>
            
            <Button 
               onClick={handleOpenCreate}
               className="rounded-xl border border-white/5 bg-red-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all hover:bg-red-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
            >
              <PlusIcon className="mr-2 size-4" />
              Configure New Plan
            </Button>
          </div>
        </motion.div>

        {/* Plan Grid */}
        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           className="rounded-3xl border border-white/5 bg-black/40 p-1 backdrop-blur-xl"
        >
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent transition-colors">
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Plan Architecture</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Cycle</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Price Point</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Operational Status</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Market Aura</TableHead>
                <TableHead className="text-right font-bold text-neutral-400 uppercase tracking-wider text-xs">Configuration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.length === 0 ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <ZapIcon className="size-10 text-neutral-800" />
                       <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest">No pricing architectures detected</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan: IPricingPlan) => (
                  <TableRow key={plan.id} className="border-white/5 transition-colors hover:bg-white/5 group">
                    <TableCell className="py-4">
                       <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 group-hover:bg-red-600/20 group-hover:ring-red-600/40 transition-all">
                             <ShieldIcon className="size-5 text-neutral-400 group-hover:text-red-500" />
                          </div>
                          <div>
                             <p className="font-black text-white uppercase italic tracking-tight">{plan.name}</p>
                             <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">STRIPE_ID: {plan.stripePriceId || "UNLINKED"}</p>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="ghost" className="rounded-md border border-white/5 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                        {plan.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                          <p className="text-lg font-black text-white tracking-tighter">${plan.price}</p>
                          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Per {plan.plan === "MONTHLY" ? "Module" : "Cycle"}</p>
                       </div>
                    </TableCell>
                    <TableCell>
                      {plan.isActive ? (
                        <div className="flex items-center gap-2">
                           <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Online</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                           <CircleIcon className="size-2 text-neutral-700" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-neutral-700">Deactivated</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {plan.isPopular && (
                        <Badge className="bg-blue-600 text-white rounded-md px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)] border-none">
                          Popular Aura
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-xl bg-white/5 text-neutral-400 transition-all hover:bg-red-600/20 hover:text-red-600"
                        onClick={() => handleOpenEdit(plan)}
                      >
                        <EditIcon className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
      </div>

      {/* Configuration Uplinks */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md border-white/5 bg-black/95 p-8 text-white backdrop-blur-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black italic tracking-tighter text-white uppercase">
               Initialize Pricing Protocol
            </DialogTitle>
            <DialogDescription className="text-neutral-500 font-medium tracking-tight">
              Inject a new subscription plan into the global architecture.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="create-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Plan Designation</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-xl border-white/5 bg-white/5 py-6 text-white placeholder:text-neutral-700 focus:border-red-600/40 focus:outline-none focus:ring-0"
                placeholder="e.g. TITAN_PRIME"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="create-plan" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Configuration Cycle</Label>
                 <Select
                   value={formData.plan}
                   onValueChange={(val) => setFormData({ ...formData, plan: val })}
                 >
                   <SelectTrigger className="rounded-xl border-white/5 bg-white/5 h-12 text-white focus:ring-0 focus:border-red-600/40">
                     <SelectValue placeholder="Select type" />
                   </SelectTrigger>
                   <SelectContent className="border-white/5 bg-black text-white backdrop-blur-xl">
                     <SelectItem value="MONTHLY" className="font-bold text-xs uppercase cursor-pointer focus:bg-red-600/20 focus:text-red-600">Monthly</SelectItem>
                     <SelectItem value="YEARLY" className="font-bold text-xs uppercase cursor-pointer focus:bg-red-600/20 focus:text-red-600">Yearly</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="create-price" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Price Points (USD)</Label>
                 <Input
                   id="create-price"
                   type="number"
                   min="0"
                   step="0.01"
                   value={formData.price}
                   onChange={(e) =>
                     setFormData({ ...formData, price: e.target.value })
                   }
                   className="rounded-xl border-white/5 bg-white/5 h-12 text-white focus:border-red-600/40"
                   placeholder="0.00"
                   required
                 />
               </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-features" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Enabled Modules (One per line)</Label>
              <textarea
                id="create-features"
                className="flex w-full rounded-xl border border-white/5 bg-white/5 px-3 py-4 text-sm text-neutral-300 placeholder:text-neutral-700 shadow-sm focus:border-red-600/40 focus:outline-none focus:ring-0 min-h-[120px]"
                placeholder="UNLIMITED_TRANSMISSIONS&#10;HOLOGRAPHIC_ACCESS&#10;PRIORITY_UPLINK"
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
               <div className="flex items-center space-x-3 rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/[0.07]">
                 <Checkbox
                   id="create-isPopular"
                   checked={formData.isPopular}
                   onCheckedChange={(checked) =>
                     setFormData({ ...formData, isPopular: checked as boolean })
                   }
                   className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                 />
                 <Label
                   htmlFor="create-isPopular"
                   className="text-[10px] font-black uppercase tracking-widest text-neutral-400 cursor-pointer"
                 >
                   Popular Aura
                 </Label>
               </div>
               <div className="flex items-center space-x-3 rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/[0.07]">
                 <Checkbox
                   id="create-isActive"
                   checked={formData.isActive}
                   onCheckedChange={(checked) =>
                     setFormData({ ...formData, isActive: checked as boolean })
                   }
                   className="border-white/20 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                 />
                 <Label
                   htmlFor="create-isActive"
                   className="text-[10px] font-black uppercase tracking-widest text-neutral-400 cursor-pointer"
                 >
                   Online Status
                 </Label>
               </div>
            </div>

            <DialogFooter className="mt-8 gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCreateOpen(false)}
                className="flex-1 rounded-xl border border-white/5 bg-white/5 py-6 text-xs font-black uppercase tracking-widest text-white hover:bg-white/10"
              >
                Abort
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending}
                className="flex-1 rounded-xl bg-red-600 py-6 text-xs font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:bg-red-700"
              >
                {createMutation.isPending ? "transmitting..." : "Initialize Plan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Configuration terminal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md border-white/5 bg-black/95 p-8 text-white backdrop-blur-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black italic tracking-tighter text-white uppercase">
               Edit Pricing Parameters
            </DialogTitle>
            <DialogDescription className="text-neutral-500 font-medium tracking-tight">
              Modify the architectural specifications for the selected plan.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Plan Designation</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-xl border-white/5 bg-white/5 py-6 text-white placeholder:text-neutral-700 focus:border-red-600/40 focus:outline-none focus:ring-0"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="edit-price" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Price Points (USD)</Label>
                 <Input
                   id="edit-price"
                   type="number"
                   min="0"
                   step="0.01"
                   value={formData.price}
                   onChange={(e) =>
                     setFormData({ ...formData, price: e.target.value })
                   }
                   className="rounded-xl border-white/5 bg-white/5 h-12 text-white focus:border-red-600/40"
                   required
                 />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="edit-stripe-price" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Stripe Sync ID</Label>
                  <Input
                    id="edit-stripe-price"
                    value={formData.stripePriceId}
                    onChange={(e) =>
                      setFormData({ ...formData, stripePriceId: e.target.value })
                    }
                    className="rounded-xl border-white/5 bg-white/5 h-12 text-white focus:border-red-600/40"
                    placeholder="price_..."
                  />
               </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-features" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Enabled Modules</Label>
              <textarea
                id="edit-features"
                className="flex w-full rounded-xl border border-white/5 bg-white/5 px-3 py-4 text-sm text-neutral-300 shadow-sm focus:border-red-600/40 focus:outline-none focus:ring-0 min-h-[120px]"
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
               <div className="flex items-center space-x-3 rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/[0.07]">
                 <Checkbox
                   id="edit-isPopular"
                   checked={formData.isPopular}
                   onCheckedChange={(checked) =>
                     setFormData({ ...formData, isPopular: checked as boolean })
                   }
                   className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                 />
                 <Label
                   htmlFor="edit-isPopular"
                   className="text-[10px] font-black uppercase tracking-widest text-neutral-400 cursor-pointer"
                 >
                   Popular Aura
                 </Label>
               </div>
               <div className="flex items-center space-x-3 rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/[0.07]">
                 <Checkbox
                   id="edit-isActive"
                   checked={formData.isActive}
                   onCheckedChange={(checked) =>
                     setFormData({ ...formData, isActive: checked as boolean })
                   }
                   className="border-white/20 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                 />
                 <Label
                   htmlFor="edit-isActive"
                   className="text-[10px] font-black uppercase tracking-widest text-neutral-400 cursor-pointer"
                 >
                   Online Status
                 </Label>
               </div>
            </div>

            <DialogFooter className="mt-8 gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditOpen(false)}
                className="flex-1 rounded-xl border border-white/5 bg-white/5 py-6 text-xs font-black uppercase tracking-widest text-white hover:bg-white/10"
              >
                Abort
              </Button>
              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
                className="flex-1 rounded-xl bg-blue-600 py-6 text-xs font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-blue-700"
              >
                {updateMutation.isPending ? "Syncing..." : "Commit Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PricingManagement;
