"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Mail, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: "Form tidak lengkap",
        description: "Nama, email, dan komentar wajib diisi",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim feedback");

      toast({ title: "Terima kasih!", description: "Masukan Anda telah dikirim." });
      setName("");
      setEmail("");
      setMessage("");
      router.push("/docs");
    } catch (err: any) {
      toast({
        title: "Gagal mengirim",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-terminal-green bg-terminal-dark">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <MessageCircle className="h-10 w-10 text-terminal-green" />
            </div>
            <CardTitle className="text-2xl text-center text-terminal-green">
              Kirim Masukan
            </CardTitle>
            <CardDescription className="text-center text-terminal-green/70">
              Kami menghargai pendapat Anda
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-terminal-green" />
                <Input
                  placeholder="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-black border-terminal-green/30 text-terminal-green"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-terminal-green" />
                <Input
                  type="email"
                  placeholder="Email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-black border-terminal-green/30 text-terminal-green"
                />
              </div>
              <Textarea
                placeholder="Apa yang ingin Anda sampaikan?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-black border-terminal-green/30 text-terminal-green min-h-[100px]"
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full border border-terminal-green text-terminal-green bg-terminal-dark hover:bg-terminal-green/20"
              >
                {isLoading ? "Mengirim..." : "Kirim Feedback"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}