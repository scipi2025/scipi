"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function ContactPage() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await response.json();
        setError(data.error || t("contact.error"));
      }
    } catch (err) {
      setError(t("contact.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4">
          {t("contact.title")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-[700px]">
          {t("contact.intro")}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t("contact.sendMessage")}</CardTitle>
            <CardDescription>
              {t("contact.formIntro")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <CheckCircle2 className="size-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("contact.success")}</h3>
                <p className="text-muted-foreground mb-4">
                  {language === "en" 
                    ? "Thank you for your message. We will get back to you as soon as possible." 
                    : "Îți mulțumim pentru mesaj. Îți vom răspunde în cel mai scurt timp posibil."}
                </p>
                <Button onClick={() => setSuccess(false)}>
                  {language === "en" ? "Send Another Message" : "Trimite Alt Mesaj"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("contact.fullName")} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      placeholder={language === "en" ? "John Doe" : "Ion Popescu"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("contact.email")} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      placeholder={language === "en" ? "john.doe@email.com" : "ion.popescu@email.com"}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t("contact.subject")} *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                    placeholder={language === "en" ? "What would you like to discuss?" : "Despre ce vrei să discutăm?"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t("contact.message")} *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={6}
                    placeholder={language === "en" ? "Write your message here..." : "Scrie mesajul tău aici..."}
                  />
                </div>
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading ? (
                    t("contact.sending")
                  ) : (
                    <>
                      <Send className="mr-2 size-4" />
                      {t("contact.send")}
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
