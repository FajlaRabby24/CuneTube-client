import ContactMessages from "@/components/modules/Admin/ContactMessages";
import { getAllContactMessages } from "@/services/Contact/contact.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const ContactMessagesPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin-contact-messages", 1, ""],
    queryFn: () => getAllContactMessages("page=1&limit=10"),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContactMessages />
    </HydrationBoundary>
  );
};

export default ContactMessagesPage;
