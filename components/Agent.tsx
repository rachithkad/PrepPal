"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Phone, PhoneOff } from "lucide-react";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Call View */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
          {/* AI Interviewer Card */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md border-2 border-blue-500/30">
            <div className="relative mx-auto w-32 h-32 mb-4">
              <Image
                src="/ai-avatar.png"
                alt="AI Interviewer"
                width={128}
                height={128}
                className="rounded-full object-cover border-4 border-blue-500"
              />
              <AnimatePresence>
                {isSpeaking && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2"
                  >
                    <Mic className="h-4 w-4 text-white" />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
              AI Interviewer
            </h3>
          </div>

          {/* User Profile Card */}
          <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-0.5 rounded-2xl w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 h-full">
              <div className="mx-auto w-32 h-32 mb-4">
                <Image
                  src="/user-avatar.png"
                  alt={userName || "User"}
                  width={128}
                  height={128}
                  className="rounded-full object-cover border-4 border-emerald-500"
                />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
                {userName || "You"}
              </h3>
            </div>
          </div>
        </div>

        {/* Transcript */}
        <AnimatePresence>
          {messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto"
            >
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Mic className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                </div>
                <motion.p
                  key={lastMessage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-700 dark:text-gray-300"
                >
                  {lastMessage}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call Controls */}
        <div className="flex justify-center">
          {callStatus !== "ACTIVE" ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCall}
              disabled={callStatus === "CONNECTING"}
              className={`relative flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-medium shadow-lg ${
                callStatus === "CONNECTING"
                  ? "bg-blue-600 cursor-wait"
                  : "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
              }`}
            >
              {callStatus === "CONNECTING" && (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute border-2 border-white border-t-transparent rounded-full w-6 h-6"
                />
              )}
              <Phone className="h-5 w-5" />
              <span>
                {callStatus === "INACTIVE" || callStatus === "FINISHED"
                  ? "Start Interview"
                  : "Connecting..."}
              </span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDisconnect}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg"
            >
              <PhoneOff className="h-5 w-5" />
              <span>End Interview</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agent;