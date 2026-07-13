"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAllContactMessages,
  IContactMessage,
} from "@/services/Contact/contact.service";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";

interface IContactMessagesAPIResponse {
  success: boolean;
  message?: string;
  data: IContactMessage[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const ContactMessages = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] =
    useState<IContactMessage | null>(null);

  const limit = 10;
  const queryString = `page=${page}&limit=${limit}${search ? `&searchTerm=${search}` : ""}`;

  const { data, isLoading } = useQuery<IContactMessagesAPIResponse>({
    queryKey: ["admin-contact-messages", page, search],
    queryFn: () =>
      getAllContactMessages(
        queryString,
      ) as Promise<IContactMessagesAPIResponse>,
  });

  const messages = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-white">
            Contact Messages
          </h1>
          <p className="text-sm text-slate-400">
            Read and manage user inquiries and feedback.
          </p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name, email, subject..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10 bg-slate-950/40 border-white/10 text-white placeholder-slate-500 focus-visible:ring-red-600 focus-visible:border-red-600 rounded-xl"
          />
        </div>
      </div>

      {/* Messages Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900/20 backdrop-blur-md">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MailIcon className="h-12 w-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              No Messages Found
            </h3>
            <p className="text-slate-400 mt-1 max-w-xs text-sm">
              {search
                ? "We couldn't find any message matching your criteria."
                : "No contact submissions have been received yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-950/30">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-slate-400 py-4 pl-6">
                    Sender
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-slate-400 py-4">
                    Phone
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-slate-400 py-4">
                    Subject
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-slate-400 py-4">
                    Date
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-wider text-slate-400 py-4 pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg, index) => (
                  <motion.tr
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{msg.name}</span>
                        <span className="text-xs text-slate-400">
                          {msg.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-slate-300 font-medium">
                      {msg.phone || "N/A"}
                    </TableCell>
                    <TableCell className="py-4 text-slate-200 font-semibold max-w-[200px] truncate">
                      {msg.subject}
                    </TableCell>
                    <TableCell className="py-4 text-slate-400 text-xs">
                      {format(new Date(msg.createdAt), "MMM dd, yyyy h:mm a")}
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedMessage(msg)}
                        className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-lg text-xs"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <p className="text-xs text-slate-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="bg-slate-900/40 border-white/10 text-white hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="bg-slate-900/40 border-white/10 text-white hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={(open) => !open && setSelectedMessage(null)}
      >
        <DialogContent className="bg-slate-900/95 border border-white/10 text-white rounded-2xl max-w-xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase tracking-wider flex items-center gap-2 text-white">
              <MailIcon className="h-5 w-5 text-red-500" />
              Inquiry Details
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Read the full contact message submitted by this user.
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-6 py-4">
              {/* Sender Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <div className="flex items-start gap-2.5">
                  <UserIcon className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Name
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {selectedMessage.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <MailIcon className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Email Address
                    </span>
                    <span className="text-sm font-semibold text-white break-all">
                      {selectedMessage.email}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <PhoneIcon className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Phone Number
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {selectedMessage.phone || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CalendarIcon className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Date Submitted
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {format(
                        new Date(selectedMessage.createdAt),
                        "MMM dd, yyyy h:mm a",
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileTextIcon className="h-3 w-3" />
                  Subject
                </span>
                <span className="text-base font-bold text-white border-l-2 border-red-500 pl-3">
                  {selectedMessage.subject}
                </span>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Message Content
                </span>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 max-h-48 overflow-y-auto text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactMessages;
