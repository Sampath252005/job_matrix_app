// import UpdateJobForm from "@/components/jobs/updateJobForm";
// import { updateJob } from "@/services/jobs.services";

// export default function UpdateJobPage({ params }: any) {
//   const handleUpdate = async (data: any) => {
//     try {
//       await updateJob(params.id, data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <UpdateJobForm
//       initialData={{
//         title: "Frontend Developer",
//         company: "Google",
//         location: "Bangalore",
//         salary: "10-15 LPA",
//         description: "React developer role...",
//       }}
//       onSubmit={handleUpdate}
//     />
//   );
// }

// Keep the dynamic route a valid Next.js page while job editing lives at
// `/recruiter/jobs/[id]/update`.
export default function JobPage() {
  return null;
}
