'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Globe, Star, User, Languages, Award, Users, Mail, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { getAuditorById, getAuditFirmById } from '@/api/auditor.api';
import * as React from 'react';

export default function AuditorProfilePage() {
  const params = useParams();
  const auditorId = Array.isArray(params?.profile) ? params.profile[0] : params?.profile;

  const [auditor, setAuditor] = useState<any>(null);
  const [firm, setFirm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAuditorAndFirm() {
      setLoading(true);
      setError(null);
      try {
        if (!auditorId || typeof auditorId !== 'string') {
          setError('No auditor profile found for this ID.');
          setAuditor(null);
          setFirm(null);
          setLoading(false);
          return;
        }
        const auditorRes = await getAuditorById(auditorId);
        const auditorData = auditorRes?.data || auditorRes;
        setAuditor(auditorData);
        if (auditorData?.auditFirmId) {
          const firmRes = await getAuditFirmById(auditorData.auditFirmId);
          setFirm(firmRes?.data || firmRes);
        } else {
          setFirm(null);
        }
      } catch (e: any) {
        setError('No auditor profile found for this ID.');
        setAuditor(null);
        setFirm(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAuditorAndFirm();
  }, [auditorId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  if (error || !auditor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Auditor Not Found</h1>
        <p className="text-muted-foreground">{error || 'No auditor profile found for this ID.'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen h-screen bg-gradient-to-br from-background via-muted/60 to-background">
      <header className="w-full border-b px-6 py-6 bg-card/80 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-6 max-w-3xl mx-auto">
          <Avatar className="h-28 w-28 shadow-lg border-4 border-primary/30">
            <AvatarImage src={auditor.avatarUrl || ''} alt={auditor.name} />
            <AvatarFallback className="rounded-lg text-3xl bg-muted">
              <User className="h-12 w-12 text-primary mx-auto" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-4xl font-bold flex items-center gap-3 mb-1">{auditor.name}
              {auditor.vettedStatus === 'APPROVED' && (
                <Badge variant="outline" className="flex items-center gap-1 text-green-700 border-green-600 text-base px-2 py-1">
                  <CheckCircle className="h-5 w-5 text-green-600" /> Verified
                </Badge>
              )}
            </h1>
            <div className="text-muted-foreground text-lg mt-1 font-medium">
              {firm?.name ? `${firm.name} (${firm.firmSize})` : 'No Audit Firm'}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex justify-center w-full overflow-y-auto max-h-[calc(100vh-120px)]">
        <div className="w-full max-w-3xl px-4 py-10 space-y-10">
          <Card className="shadow-2xl border border-primary/10 rounded-2xl bg-card/90">
            <CardContent className="space-y-8 p-8">
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Professional Summary</CardTitle>
                </div>
                <div className="flex flex-wrap gap-4 text-base font-medium">
                  <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> Licensed in {firm?.registeredIn || '-'}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {auditor.yearsExperience} Years Experience</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> Specializing in {auditor.specialties?.join(', ') || '-'}</span>
                </div>
              </section>
              <hr className="my-2 border-muted" />
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Languages className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Languages & Performance</CardTitle>
                </div>
                <div className="flex flex-wrap gap-4 text-base font-medium">
                  <span>Languages: {auditor.languages?.join(', ') || '-'}</span>
                  <span>Avg. Response Time: {auditor.avgResponseTime ? `${auditor.avgResponseTime} hours` : '-'}</span>
                  <span>Avg. Completion Time: {auditor.avgCompletion ? `${auditor.avgCompletion} days` : '-'}</span>
                </div>
              </section>
              <hr className="my-2 border-muted" />
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-xl">Reputation</CardTitle>
                </div>
                <div className="flex flex-wrap gap-4 text-base font-medium">
                  <span>{auditor.successCount || 0} Successful Engagements via Sheetsway</span>
                  <span className="flex items-center gap-1"><Star className="h-5 w-5 text-yellow-500" /> {auditor.rating || '-'} / 5.0 (based on {auditor.reviewsCount || 0} client reviews)</span>
                </div>
              </section>
              <hr className="my-2 border-muted" />
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Audit Firm Details</CardTitle>
                </div>
                {firm ? (
                  <div className="space-y-2">
                    <div><b>Name:</b> {firm.name}</div>
                    <div><b>License Number:</b> {firm.licenseNumber}</div>
                    <div><b>Registered In:</b> {firm.registeredIn}</div>
                    <div><b>Firm Size:</b> {firm.firmSize}</div>
                    <div><b>Languages:</b> {firm.languages?.join(', ') || '-'}</div>
                    <div><b>Specialties:</b> {firm.specialties?.join(', ') || '-'}</div>
                  </div>
                ) : (
                  <div>No audit firm information available.</div>
                )}
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 