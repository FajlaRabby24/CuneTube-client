import { UpdateProfileForm } from "@/components/modules/Auth/update-profile-form";

const UpdateProfilePage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdateProfileForm />
      </div>
    </div>
  );
};

export default UpdateProfilePage;