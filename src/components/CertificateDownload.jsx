"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import jsPDF from 'jspdf';

export default function CertificateDownload({ courseId, progress, courseData, userId }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState('');
    const { data: session, status } = useSession();

    //console.log(session);

    // Simple PDF generation without html2canvas
    const generateSimpleCertificate = async (certificateData) => {
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Set background color
        pdf.setFillColor(102, 126, 234);
        pdf.rect(0, 0, 297, 210, 'F');

        // Main content area
        pdf.setFillColor(255, 255, 255);
        pdf.rect(10, 13, 277, 190, 'F');

        // Title
        // For the main "CERTIFICATE" text - Bold
        
        pdf.setFontSize(32);
        pdf.setTextColor(45, 55, 72);
        pdf.setFont(undefined, 'bold'); // Set to bold
        pdf.text('CERTIFICATE', 148.5, 30, { align: 'center' });

        // For the "of Completion" text - Italic
        pdf.setFontSize(18);
        pdf.setTextColor(74, 85, 104);
        pdf.setFont(undefined, 'italic'); // Set to italic
        pdf.text('of Completion', 148.5, 40, { align: 'center' });

        // Decorative line
        pdf.setDrawColor(102, 126, 234);
        pdf.setLineWidth(0.5);
        pdf.line(50, 50, 247, 50);

        // Student name
        pdf.setFontSize(20);
        pdf.setTextColor(74, 85, 104);
        pdf.text('This is to certify that', 148.5, 70, { align: 'center' });

        pdf.setFontSize(28);
        pdf.setTextColor(45, 55, 72);
        pdf.text(session.user.name || 'Student', 148.5, 85, { align: 'center' });

        // Course completion text
        pdf.setFontSize(16);
        pdf.setTextColor(74, 85, 104);
        pdf.text('has successfully completed the course', 148.5, 100, { align: 'center' });

        // Course title
        pdf.setFontSize(22);
        pdf.setTextColor(102, 126, 234);
        const courseTitle = `"${certificateData.courseTitle}"`;
        pdf.text(courseTitle, 148.5, 115, { align: 'center', maxWidth: 250 });

        // Instructor
        pdf.setFontSize(14);
        pdf.setTextColor(74, 85, 104);
        pdf.text(`Under the instruction of ${certificateData.instructor}`, 148.5, 130, { align: 'center' });

        // Skills section
        pdf.setFontSize(16);
        pdf.setTextColor(45, 55, 72);
        pdf.text('Skills Mastered', 148.5, 145, { align: 'center' });

        // Skills list
        pdf.setFontSize(10);
        pdf.setTextColor(74, 85, 104);
        const skills = certificateData.skills.slice(0, 6);
        skills.forEach((skill, index) => {
            const yPos = 150 + (index * 5);
            pdf.text(`• ${skill}`, 148.5, yPos, { align: 'center' });
        });

        // Footer
        pdf.setFontSize(12);
        pdf.setTextColor(113, 128, 150);

        // Instructor signature
        pdf.text('Instructor', 60, 180);
        pdf.setFontSize(14);
        pdf.setTextColor(45, 55, 72);
        pdf.text(certificateData.instructor, 60, 185);

        // Completion date
        pdf.setFontSize(12);
        pdf.setTextColor(113, 128, 150);
        pdf.text('Completion Date', 148.5, 180, { align: 'center' });
        pdf.setFontSize(14);
        pdf.setTextColor(45, 55, 72);
        pdf.text(new Date(certificateData.issueDate).toLocaleDateString(), 148.5, 185, { align: 'center' });

        // Certificate ID
        pdf.setFontSize(12);
        pdf.setTextColor(113, 128, 150);
        pdf.text('Certificate ID', 235, 180, { align: 'right' });
        pdf.setFontSize(10);
        pdf.setTextColor(45, 55, 72);
        pdf.text(certificateData.certificateId, 235, 185, { align: 'right' });

        // Congratulations message
        pdf.setFontSize(10);
        pdf.setTextColor(113, 128, 150);
        pdf.text('Congratulations on your outstanding achievement!', 148.5, 195, { align: 'center' });
        pdf.text('Your dedication and hard work have paid off.', 148.5, 200, { align: 'center' });

        return pdf;
    };

    const handleGenerateCertificate = async () => {
        if (!session || status !== 'authenticated') {
            setError('Please sign in to download certificate');
            return;
        }

        setIsGenerating(true);
        setError('');
        setDebugInfo('');

        try {
            console.log('Requesting certificate for:', { userId, courseId, clientProgress: progress });

            const response = await fetch(
                `/api/certificate?userId=${encodeURIComponent(userId)}&courseId=${encodeURIComponent(courseId)}`
            );

            const responseData = await response.json();

            if (!response.ok) {
                setDebugInfo(`Server response: ${JSON.stringify(responseData, null, 2)}`);
                throw new Error(responseData.error || `Server error: ${response.status}`);
            }

            // Generate simple PDF
            const pdf = await generateSimpleCertificate(responseData);
            pdf.save(`Certificate-${responseData.courseTitle.replace(/[^a-zA-Z0-9]/g, '-')}-${(session.user.name || 'Student').replace(/[^a-zA-Z0-9]/g, '-')}.pdf`);

        } catch (error) {
            console.error('Error generating certificate:', error);
            setError(error.message || 'Failed to generate certificate. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const refreshProgress = async () => {
        try {
            const response = await fetch(`/api/progress?userId=${encodeURIComponent(userId)}&courseId=${encodeURIComponent(courseId)}`);
            if (response.ok) {
                const data = await response.json();
                setDebugInfo(`Server progress: ${data.progress}%, Watched videos: ${data.watchedVideos?.length}`);
            }
        } catch (error) {
            console.error('Failed to refresh progress:', error);
        }
    };

    if (progress < 100) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-green-900">Course Completed! 🎉</h3>
                        <p className="text-green-700 text-sm">
                            Congratulations! You've successfully completed this course. Download your certificate below.
                        </p>
                        {error && (
                            <div className="mt-2">
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{error}</span>
                                </div>
                                {debugInfo && (
                                    <div className="mt-1 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                        <strong>Debug Info:</strong> {debugInfo}
                                    </div>
                                )}
                                <Button
                                    onClick={refreshProgress}
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 flex items-center gap-2"
                                >
                                    <RefreshCw className="h-3 w-3" />
                                    Check Server Progress
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <Button
                    onClick={handleGenerateCertificate}
                    disabled={isGenerating || status !== 'authenticated'}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                    {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                    {isGenerating ? 'Generating...' : 'Download Certificate'}
                </Button>
            </div>
        </div>
    );
}