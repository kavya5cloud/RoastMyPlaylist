import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { generateShareableImage, shareToTwitter, shareToInstagram, copyShareLink } from "@/lib/image-generator";
import type { Roast, User } from "@shared/schema";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  roast: Roast;
  user: Partial<User>;
}

export function ShareModal({ isOpen, onClose, roast, user }: ShareModalProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShareToTwitter = () => {
    shareToTwitter(roast.headline);
  };

  const handleShareToInstagram = () => {
    shareToInstagram();
  };

  const handleCopyLink = async () => {
    try {
      await copyShareLink(roast.id);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleDownloadImage = async () => {
    try {
      setIsGeneratingImage(true);
      const imageDataUrl = await generateShareableImage("roast-card");
      
      // Create download link
      const link = document.createElement("a");
      link.download = `roast-${roast.id}.png`;
      link.href = imageDataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Share Your Roast</DialogTitle>
        </DialogHeader>
        
        <div className="text-center">
          <p className="text-muted-foreground mb-6">Let everyone know about your questionable music taste</p>
          
          {/* Share Preview Card */}
          <div className="bg-muted p-4 rounded-xl mb-6">
            <div className="text-4xl mb-2">🔥</div>
            <p className="font-bold text-sm" data-testid="text-share-preview">"{roast.headline}"</p>
            <p className="text-xs text-muted-foreground mt-2">Roasted by RoastMyPlaylist.com</p>
          </div>
          
          {/* Social Media Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleShareToTwitter}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-bold inline-flex items-center justify-center gap-2 transition-all"
              data-testid="button-share-twitter"
            >
              <i className="fab fa-twitter"></i>
              Share to Twitter
            </Button>
            
            <Button 
              onClick={handleShareToInstagram}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-bold inline-flex items-center justify-center gap-2 transition-all"
              data-testid="button-share-instagram"
            >
              <i className="fab fa-instagram"></i>
              Share to Instagram
            </Button>
            
            <Button 
              onClick={handleCopyLink}
              variant="outline"
              className="w-full border border-border hover:bg-muted text-foreground px-6 py-3 rounded-full font-bold inline-flex items-center justify-center gap-2 transition-all"
              data-testid="button-copy-link"
            >
              <i className={`fas ${copySuccess ? 'fa-check' : 'fa-link'}`}></i>
              {copySuccess ? "Copied!" : "Copy Link"}
            </Button>

            <Button 
              onClick={handleDownloadImage}
              disabled={isGeneratingImage}
              variant="outline"
              className="w-full border border-border hover:bg-muted text-foreground px-6 py-3 rounded-full font-bold inline-flex items-center justify-center gap-2 transition-all"
              data-testid="button-download-image"
            >
              <i className={`fas ${isGeneratingImage ? 'fa-spinner fa-spin' : 'fa-download'}`}></i>
              {isGeneratingImage ? "Generating..." : "Download Image"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
