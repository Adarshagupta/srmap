"use client";

import { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Loader2, X, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface PDFViewerProps {
  fileUrl: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PDFViewer({ fileUrl, title, open, onOpenChange }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Create proxy URL for the PDF
  const proxyUrl = useMemo(() => {
    if (!fileUrl) return '';
    const url = new URL('/api/pdf', window.location.origin);
    url.searchParams.set('url', fileUrl);
    return url.toString();
  }, [fileUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(err: Error) {
    console.error('Error loading PDF:', err);
    setLoading(false);
    setError(err);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  // Reset state when modal is opened
  function handleOpenChange(open: boolean) {
    if (!open) {
      setPageNumber(1);
      setError(null);
      setLoading(true);
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="max-w-4xl w-[95vw] h-[90vh] p-6"
        aria-describedby="pdf-viewer-description"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <p id="pdf-viewer-description" className="sr-only">
          PDF viewer with page navigation controls. Use left and right arrow buttons to navigate between pages.
        </p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            {!error && numPages > 0 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => changePage(-1)}
                  disabled={pageNumber <= 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {pageNumber} of {numPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => changePage(1)}
                  disabled={pageNumber >= numPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              aria-label="Download PDF"
            >
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </a>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleOpenChange(false)}
              aria-label="Close PDF viewer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex justify-center bg-muted rounded-lg">
          {loading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          {error ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load the PDF viewer. Please try downloading the file instead.
                </AlertDescription>
              </Alert>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="mt-4"
              >
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </a>
            </div>
          ) : (
            <Document
              file={proxyUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center min-h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
              options={{
                cMapUrl: '/cmaps/',
                cMapPacked: true,
              }}
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="max-w-full"
                loading={
                  <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                }
              />
            </Document>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 