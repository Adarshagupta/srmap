"use client";

import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useToast } from './ui/use-toast';

interface ShareProfileProps {
  name: string;
  profileUrl: string;
}

export default function ShareProfile({ name, profileUrl }: ShareProfileProps) {
  const { toast } = useToast();

  const shareText = `Check out ${name}'s profile on SRM AP Connect!`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(profileUrl);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Link copied!",
        description: "Profile link has been copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a
            href={shareUrls.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Twitter className="mr-2 h-4 w-4" />
            Share on Twitter
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={shareUrls.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Facebook className="mr-2 h-4 w-4" />
            Share on Facebook
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={shareUrls.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Linkedin className="mr-2 h-4 w-4" />
            Share on LinkedIn
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard}>
          <LinkIcon className="mr-2 h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 