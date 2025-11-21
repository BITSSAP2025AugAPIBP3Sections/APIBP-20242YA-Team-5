import { useState, useEffect, useCallback } from 'react';
import { Certificate } from '../types/certificate';
import { CertificateService } from '../services/certificateService';

interface UseCertificatesReturn {
  certificates: Certificate[];
  loading: boolean;
  error: string | null;
  fetchCertificates: (status?: string) => Promise<void>;
  downloadCertificate: (certificateId: string) => Promise<void>;
  refreshCertificates: () => Promise<void>;
}

export const useCertificates = (): UseCertificatesReturn => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async (status?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await CertificateService.getCertificates(status);
      setCertificates(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch certificates');
      console.error('Error fetching certificates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadCertificate = useCallback(async (certificateId: string) => {
    try {
      const blob = await CertificateService.downloadCertificatePdf(certificateId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to download certificate');
      console.error('Error downloading certificate:', err);
    }
  }, []);

  const refreshCertificates = useCallback(async () => {
    await fetchCertificates();
  }, [fetchCertificates]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  return {
    certificates,
    loading,
    error,
    fetchCertificates,
    downloadCertificate,
    refreshCertificates,
  };
};

interface UseCertificateReturn {
  certificate: Certificate | null;
  loading: boolean;
  error: string | null;
  fetchCertificate: (id: string) => Promise<void>;
}

export const useCertificate = (certificateId?: string): UseCertificateReturn => {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificate = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await CertificateService.getCertificateById(id);
      setCertificate(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch certificate');
      console.error('Error fetching certificate:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (certificateId) {
      fetchCertificate(certificateId);
    }
  }, [certificateId, fetchCertificate]);

  return {
    certificate,
    loading,
    error,
    fetchCertificate,
  };
};