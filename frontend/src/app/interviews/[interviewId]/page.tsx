"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LiveKitRoom, RoomAudioRenderer, VideoConference } from "@livekit/components-react";
import { ArrowLeft, CalendarDays, Clock3, Loader2, MapPin, UserRound, Video } from "lucide-react";
import toast from "react-hot-toast";
import { getToastMessage } from "@/lib/toast";
import { getInterview, getInterviewToken, type Interview } from "@/services/interview.services";

type RoomCredentials = {
  server_url: string;
  participant_token: string;
  room_name: string;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));

export default function InterviewDetailsPage() {
  const params = useParams<{ interviewId: string }>();
  const router = useRouter();
  const interviewId = params.interviewId;
  const [interview, setInterview] = useState<Interview | null>(null);
  const [room, setRoom] = useState<RoomCredentials | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    if (!interviewId) return;
    setLoading(true);
    setFailed(false);
    try {
      setInterview(await getInterview(interviewId));
    } catch (error) {
      setFailed(true);
      toast.error(getToastMessage(error, "Unable to load interview"));
    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    void load();
  }, [load]);

  const joinRoom = async () => {
    setJoining(true);
    try {
      const credentials = await getInterviewToken(interviewId);
      setRoom(credentials);
    } catch (error) {
      toast.error(getToastMessage(error, "Unable to join interview"));
    } finally {
      setJoining(false);
    }
  };

  if (room) {
    return (
      <main className="h-dvh bg-slate-950" data-lk-theme="default">
        <LiveKitRoom
          serverUrl={room.server_url}
          token={room.participant_token}
          connect
          audio
          video
          onDisconnected={() => setRoom(null)}
          className="h-full"
        >
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </main>
    );
  }

  if (loading) {
    return <main className="grid min-h-dvh place-items-center"><div className="flex items-center gap-3 text-slate-500"><Loader2 className="animate-spin text-blue-600"/>Loading interview...</div></main>;
  }

  if (failed || !interview) {
    return <main className="grid min-h-dvh place-items-center p-5"><div className="text-center"><h1 className="text-2xl font-bold">Interview unavailable</h1><p className="mt-2 text-slate-500">We could not retrieve this interview.</p><button onClick={() => void load()} className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white">Try again</button></div></main>;
  }

  const canJoin = interview.interview_type === "ONLINE" && !["COMPLETED", "CANCELLED"].includes(interview.status);

  return (
    <main className="min-h-dvh p-4 sm:p-7">
      <div className="mx-auto max-w-5xl">
        <button onClick={() => router.back()} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-300"><ArrowLeft size={17}/>Back to interviews</button>
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <header className="bg-gradient-to-br from-slate-950 via-blue-800 to-indigo-700 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold ring-1 ring-white/20">{interview.status}</span><h1 className="mt-4 text-3xl font-black tracking-tight">{interview.title}</h1><p className="mt-2 text-blue-100">{interview.jobs?.title || "Job interview"}</p></div><span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20"><Video size={26}/></span></div>
          </header>
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_20rem]">
            <div><h2 className="text-lg font-bold">Interview details</h2><dl className="mt-5 grid gap-4 sm:grid-cols-2"><Info icon={<CalendarDays/>} label="Date and time" value={formatDate(interview.scheduled_at)}/><Info icon={<Clock3/>} label="Duration" value={`${interview.duration_minutes} minutes`}/><Info icon={<Video/>} label="Round" value={interview.round_type}/><Info icon={<UserRound/>} label="Format" value={interview.interview_type}/>{interview.location && <Info icon={<MapPin/>} label="Location" value={interview.location}/>}</dl>{interview.notes && <div className="mt-7 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Notes</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">{interview.notes}</p></div>}</div>
            <aside className="h-fit rounded-2xl border border-blue-100 bg-blue-50/70 p-5 dark:border-blue-950 dark:bg-blue-950/30"><h2 className="font-bold">Ready to join?</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Your camera and microphone will be requested when the secure room opens.</p>{canJoin ? <button disabled={joining} onClick={() => void joinRoom()} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">{joining ? <Loader2 size={17} className="animate-spin"/> : <Video size={17}/>}Join Interview</button> : <p className="mt-5 rounded-xl bg-white/80 p-3 text-center text-sm font-semibold text-slate-500 dark:bg-slate-900/60">{interview.interview_type === "OFFLINE" ? "This is an offline interview." : `This interview is ${interview.status.toLowerCase()}.`}</p>}</aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800"><span className="mt-0.5 text-blue-600 [&>svg]:h-5 [&>svg]:w-5">{icon}</span><div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{value}</dd></div></div>;
}
